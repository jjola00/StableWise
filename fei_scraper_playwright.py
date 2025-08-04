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

STORAGE_FILE = "fei_storage_state.json"

sb = create_client(SUPABASE_URL, SUPABASE_KEY)

def clean(text):
    return text.strip().replace("\xa0", " ")

def scrape_horse_with_playwright(fei_id):
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)
        context = browser.new_context(storage_state=STORAGE_FILE)
        page = context.new_page()
        
        page.goto("https://data.fei.org/Horse/Search.aspx", timeout=60000)
        page.wait_for_load_state("domcontentloaded")

        # Wait for the iframe to appear
        page.wait_for_selector("iframe")

        # Grab the iframe and its content
        frame = page.frame(name="main") or page.frames[1]  # Adjust index if necessary

        # Ensure iframe content is loaded
        frame.wait_for_selector("#ctl00_ContentPlaceHolder1_txtFEIID")

        # Fill in the form inside the iframe
        frame.fill("#ctl00_ContentPlaceHolder1_txtFEIID", fei_id)
        frame.click("#ctl00_ContentPlaceHolder1_btnSearch")
        frame.wait_for_timeout(2000)

        try:
            frame.click("table.Grid tr:nth-child(2) a")
            frame.wait_for_timeout(2000)
        except:
            print(f"[!] FEI ID {fei_id} not found or clickable.")
            browser.close()
            return

        # Extract basic horse info
        try:
            name = frame.locator("text=Birth Name").locator("xpath=..").locator("td").nth(1).inner_text()
            dob_text = frame.locator("text=Date of Birth").locator("xpath=..").locator("td").nth(1).inner_text()
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