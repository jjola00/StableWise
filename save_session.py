# save_session.py
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=False, slow_mo=150)
    context = browser.new_context()
    page = context.new_page()
    page.goto("https://data.fei.org/Horse/Search.aspx")
    input("🖐  Solve the CAPTCHA in the window, then press ENTER here...")
    context.storage_state(path="fei_storage_state.json")
    print("✅ Session saved to fei_storage_state.json")
    browser.close()
