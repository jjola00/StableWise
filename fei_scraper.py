import os
import sys
import time
from datetime import datetime
from dotenv import load_dotenv
from supabase import create_client
from playwright.sync_api import sync_playwright

# Load credentials from .env
load_dotenv()
SUPABASE_URL = os.getenv("VITE_SUPABASE_URL")
SUPABASE_KEY = os.getenv("VITE_SUPABASE_ANON_KEY")
if not SUPABASE_URL or not SUPABASE_KEY:
    raise RuntimeError("Missing Supabase credentials in .env")

sb = create_client(SUPABASE_URL, SUPABASE_KEY)

def clean(text):
    return text.strip().replace("\xa0", " ")

def scrape_horse_with_playwright(fei_id):
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        
        # Step 1: Go to Search page and search FEI ID
        page.goto("https://data.fei.org/Horse/Search.aspx")
        page.fill("#ctl00_ContentPlaceHolder1_txtFEIID", fei_id)
        page.click("#ctl00_ContentPlaceHolder1_btnSearch")
        page.wait_for_timeout(2000)

        # Step 2: Click on the result row (assumes 1st result is correct)
        try:
            page.click("table.Grid tr:nth-child(2) a")
            page.wait_for_timeout(2000)
        except:
            print(f"[!] FEI ID {fei_id} not found or clickable.")
            browser.close()
            return

        # Step 3: Extract data from Detail page
        try:
            name = page.locator("text=Birth Name").locator("xpath=..").locator("td").nth(1).inner_text()
            dob_text = page.locator("text=Date of Birth").locator("xpath=..").locator("td").nth(1).inner_text()
            dob = datetime.strptime(dob_text, "%d/%m/%Y").date() if dob_text else None

            horse = {
                "fei_id": fei_id,
                "name": clean(name),
                "date_of_birth": dob,
                "verified_source": "FEI",
            }

            sb.table("horses").upsert(horse, on_conflict="fei_id").execute()
            print(f"[+] {fei_id} stored")

        except Exception as e:
            print(f"[!] Error extracting data for {fei_id}: {e}")

        browser.close()

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python fei_scraper_playwright.py FEI_ID [FEI_ID …]")
        sys.exit(1)
    for fei_id in sys.argv[1:]:
        scrape_horse_with_playwright(fei_id.strip())
        time.sleep(1.0)