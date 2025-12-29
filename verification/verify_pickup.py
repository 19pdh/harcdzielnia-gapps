import sys
from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page()
    page.goto("http://localhost:5173")

    # Wait for items to load (longer timeout and correct selector)
    try:
        page.wait_for_selector(".container .item-card", timeout=15000)
    except Exception as e:
        print(f"Timeout waiting for items: {e}")
        page.screenshot(path="verification/timeout_debug.png")
        sys.exit(1)

    # Click on the first item
    page.click(".container .item-card:first-child a")

    # Verify ItemDetail page loaded
    page.wait_for_selector(".item-detail")

    # Check for "Odbieram" button
    button = page.get_by_text("Odbieram")
    if not button.is_visible():
        print("Odbieram button not found")
        sys.exit(1)

    # Click "Odbieram"
    button.click()

    # Verify Modal is open
    modal = page.locator(".modal-content")
    if not modal.is_visible():
        print("Modal not visible")
        sys.exit(1)

    page.screenshot(path="verification/modal_open.png")
    print("Screenshot saved to verification/modal_open.png")

    # Test Password Logic
    # 1. Wrong password
    page.fill("input[placeholder=\"Hasło\"]", "wrongpassword")
    page.click("text=Zatwierdź")

    error_msg = page.get_by_text("Niepoprawne hasło")
    if not error_msg.is_visible():
        print("Error message not visible")
        sys.exit(1)

    page.screenshot(path="verification/modal_error.png")

    # 2. Correct password
    page.fill("input[placeholder=\"Hasło\"]", "Na słowie harcerza polegaj jak na Zawiszy")
    page.click("text=Zatwierdź")

    # Wait for success message
    success_msg = page.get_by_text("Sukces!")
    success_msg.wait_for()

    page.screenshot(path="verification/modal_success.png")

    # Close modal and verify navigation
    page.click("text=Zamknij")

    # Should be back on home
    page.wait_for_url("http://localhost:5173/")

    print("Verification successful")
    browser.close()

with sync_playwright() as playwright:
    run(playwright)
