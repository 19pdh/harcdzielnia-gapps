from playwright.sync_api import sync_playwright, expect
import time

def verify_category_persistence():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()

        try:
            # Navigate to home
            print("Navigating to home...")
            page.goto('http://localhost:5173')

            # Wait for items to load
            expect(page.locator('.item-card').first).to_be_visible(timeout=10000)
            print("Items loaded.")

            # Verify initial state
            # "Wszystko" should be active
            # The active button has class 'active'
            initial_active = page.locator('button.active span').text_content()
            print(f"Initial active category: {initial_active}")
            if initial_active != "Wszystko":
                 raise Exception(f"Expected 'Wszystko' to be active, but got '{initial_active}'")

            # Find a category that is NOT "Wszystko" and NOT "Inne" (to have some items ideally)
            # We'll just pick the second button (index 1)
            category_buttons = page.locator('aside button')
            count = category_buttons.count()
            if count < 2:
                raise Exception("Not enough categories found")

            target_button = category_buttons.nth(1)
            target_category_name = target_button.locator('span').text_content()
            print(f"Selecting category: {target_category_name}")

            target_button.click()

            # Verify it is active
            expect(target_button).to_have_class("active")

            # Wait for list to filter (optional, but good practice)
            time.sleep(1)

            # Click on the first item card
            print("Navigating to item details...")
            page.locator('.item-card').first.click()

            # Wait for item detail page
            expect(page.locator('.item-detail')).to_be_visible()

            # Go back using the "Wróć" link
            print("Clicking 'Wróć'...")
            page.locator('.item-view-back-link').click()

            # Wait for home page
            expect(page.locator('.home')).to_be_visible()

            # Verify the category is still selected
            print(f"Verifying category '{target_category_name}' is still selected...")
            # We look for the button with the target name and check if it has class 'active'
            # OR we check which button is active

            active_button = page.locator('button.active')
            active_category_name = active_button.locator('span').text_content()

            if active_category_name != target_category_name:
                 raise Exception(f"Persistence Failed! Expected '{target_category_name}' to be active, but got '{active_category_name}'")

            print("Success! Category persisted after 'Wróć' link.")

            # Test Browser Back button
            # Select a different category to be sure
            if count > 2:
                 target_button_2 = category_buttons.nth(2)
                 target_category_name_2 = target_button_2.locator('span').text_content()
                 print(f"Selecting category 2: {target_category_name_2}")
                 target_button_2.click()

                 print("Navigating to item details...")
                 page.locator('.item-card').first.click()
                 expect(page.locator('.item-detail')).to_be_visible()

                 print("Clicking Browser Back...")
                 page.go_back()

                 expect(page.locator('.home')).to_be_visible()

                 active_button = page.locator('button.active')
                 active_category_name = active_button.locator('span').text_content()

                 if active_category_name != target_category_name_2:
                     raise Exception(f"Persistence Failed after Browser Back! Expected '{target_category_name_2}', got '{active_category_name}'")

                 print("Success! Category persisted after Browser Back.")

            # Take screenshot
            page.screenshot(path='verification/category_persistence.png')
            print("Screenshot saved to verification/category_persistence.png")

        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path='verification/error_persistence.png')
            raise e
        finally:
            browser.close()

if __name__ == "__main__":
    verify_category_persistence()
