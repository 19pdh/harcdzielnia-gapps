import sys
from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page()
    page.goto("http://localhost:5173")

    # Wait for items to load
    try:
        page.wait_for_selector(".container .item-card", timeout=15000)
    except Exception as e:
        print(f"Timeout waiting for items: {e}")
        sys.exit(1)

    # Click on the first item
    page.click(".container .item-card:first-child a")

    # Verify ItemDetail page loaded
    page.wait_for_selector(".item-detail")

    # Check "Odbieram" button visibility and capture it
    button_container = page.locator(".add-item-button").last
    if not button_container.is_visible():
        print("Odbieram button container not found")
        sys.exit(1)

    # Scroll to bottom
    page.evaluate("window.scrollTo(0, document.body.scrollHeight)")

    # Take screenshot of the ItemDetail page to see the button style
    page.screenshot(path="verification/style_check_item.png")

    # Click "Odbieram"
    button_container.click()

    # Verify Modal is open
    modal = page.locator(".modal-content")
    if not modal.is_visible():
        print("Modal not visible")
        sys.exit(1)

    # Take screenshot of the Modal to see the button styles
    page.screenshot(path="verification/style_check_modal.png")

    print("Verification screenshots saved to verification/style_check_item.png and verification/style_check_modal.png")
    browser.close()

with sync_playwright() as playwright:
    run(playwright)
