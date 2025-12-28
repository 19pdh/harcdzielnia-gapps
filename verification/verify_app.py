from playwright.sync_api import sync_playwright, expect
import time

def verify_app():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()

        # Listen to console logs
        page.on("console", lambda msg: print(f"BROWSER CONSOLE: {msg.text}"))
        page.on("pageerror", lambda err: print(f"BROWSER ERROR: {err}"))

        try:
            # Navigate to the app
            page.goto("http://localhost:5174")

            # Wait for content
            # Expecting "Lista umundurowania"
            expect(page.get_by_text("Lista umundurowania")).to_be_visible()

            # Check for items or empty state
            # If items are loaded, .item-card should exist.
            # If empty, "Tutaj jeszcze nic nie ma..." should exist.

            # Let's wait a bit for async fetch
            time.sleep(2)

            if page.locator(".item-card").count() > 0:
                 print("Items loaded!")
                 # ... click logic ...
                 first_item = page.locator(".item-card").first
                 item_name = first_item.locator("p").first.inner_text()
                 print(f"Clicking item: {item_name}")
                 first_item.click()
                 expect(page.get_by_text(item_name)).to_be_visible()
                 page.screenshot(path="verification/item_detail.png")
                 page.get_by_text("Wróć").click()
            else:
                 print("No items loaded. Checking for empty state message.")
                 if page.get_by_text("Tutaj jeszcze nic nie ma...").is_visible():
                     print("Empty state visible.")
                 else:
                     print("Neither items nor empty state visible? Maybe loading.")

            page.screenshot(path="verification/home_debug.png")

        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path="verification/error.png")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_app()
