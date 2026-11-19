import unittest

from backend.app.services.ikhedut_scraper import normalize_portal_categories


class ScraperNormalizationTests(unittest.TestCase):
    def test_category_name_and_description_use_their_own_language_ids(self):
        payload = {
            "data": {
                "Schemas": [
                    {
                        "groupingid": "category-1",
                        "groupshortname": "Agriculture",
                        "grouplanguageid": 1,
                        "languageid": 3,
                        "description": "<p>ગુજરાતી વર્ણન</p>",
                    },
                    {
                        "groupingid": "category-1",
                        "groupshortname": "Agriculture",
                        "grouplanguageid": 1,
                        "languageid": 1,
                        "description": "<p>English description</p>",
                    },
                    {
                        "groupingid": "category-1",
                        "groupshortname": "ખેતીવાડી",
                        "grouplanguageid": 3,
                        "languageid": 3,
                        "description": "<p>ગુજરાતી વર્ણન</p>",
                    },
                ]
            }
        }

        categories = normalize_portal_categories(payload)

        self.assertEqual(len(categories), 1)
        category = categories[0]
        self.assertEqual(category["name_en"], "Agriculture")
        self.assertEqual(category["name_gu"], "ખેતીવાડી")
        self.assertEqual(category["description_en"], "English description")
        self.assertEqual(category["description_gu"], "ગુજરાતી વર્ણન")
        self.assertNotIn("<p>", category["description_en"])
        self.assertEqual(category["record_type"], "portal_category")

    def test_invalid_or_empty_payload_fails_instead_of_returning_empty_success(self):
        for payload in ({}, {"data": {"Schemas": []}}):
            with self.subTest(payload=payload):
                with self.assertRaises(ValueError):
                    normalize_portal_categories(payload)


if __name__ == "__main__":
    unittest.main()
