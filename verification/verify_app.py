import re
from playwright.sync_api import sync_playwright, expect

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Assuming the app is running on port 5173 (Vite default)
        page = browser.new_page()
        try:
            page.goto("http://localhost:5173")

            # 1. Verify Header
            # Check for the logo image using alt text
            expect(page.get_by_alt_text("Harcdzielnia logo")).to_be_visible()

            # Check for the main heading "Harcdzielnia"
            expect(page.get_by_role("heading", name="Harcdzielnia", exact=True)).to_be_visible()

            # Check for the subtitle
            expect(page.get_by_text("Drugie życie mundurów")).to_be_visible()

            # 2. Verify "Chcę oddać mundur!" button
            add_button = page.get_by_text("Chcę oddać mundur!")
            expect(add_button).to_be_visible()

            # 3. Verify Categories are loaded
            expect(page.get_by_text("Mundury")).to_be_visible()

            # 4. Verify Items are loaded
            expect(page.locator(".item-card").first).to_be_visible()

            # 5. Verify Navigation to "About" section
            expect(page.get_by_role("heading", name="Co to harcdzielnia?")).to_be_visible()

            # 6. Verify clicking an item goes to detail page
            first_item = page.locator(".item-card").first
            # The item title is in a p tag inside .name div
            item_title = first_item.locator(".name p").text_content()
            first_item.click()

            expect(page).to_have_url(re.compile(r".*/item/.*"))
            expect(page.get_by_role("heading", name=item_title)).to_be_visible()

            page.screenshot(path="verification/success.png")
            print("Verification successful!")

        except Exception as e:
            print(f"Verification failed: {e}")
            page.screenshot(path="verification/error.png")
            raise e
        finally:
            browser.close()

if __name__ == "__main__":
    run()
