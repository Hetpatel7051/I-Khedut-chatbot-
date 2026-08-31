import cachetools

# Simple TTL Cache for Mandi Prices
cache = cachetools.TTLCache(maxsize=100, ttl=7200)

async def fetch_mandi_prices(market=None, commodity=None):
    # Simulated Mandi Prices for Gujarat
    prices = [
        {"market_name_gu": "ઊંઝા", "commodity_gu": "જીરું", "min_price": 4800, "max_price": 5950, "modal_price": 5200, "unit_gu": "૨૦ કિગ્રા", "date": "આજે"},
        {"market_name_gu": "ગોંડલ", "commodity_gu": "કપાસ (શંકર-6)", "min_price": 1400, "max_price": 1685, "modal_price": 1500, "unit_gu": "૨૦ કિગ્રા", "date": "આજે"},
        {"market_name_gu": "રાજકોટ", "commodity_gu": "મગફળી", "min_price": 1000, "max_price": 1200, "modal_price": 1100, "unit_gu": "૨૦ કિગ્રા", "date": "આજે"}
    ]
    
    # Filter based on query
    if market:
        prices = [p for p in prices if market.lower() in p["market_name_gu"].lower() or market.lower() in p.get("market_name", "").lower()]
    if commodity:
        prices = [p for p in prices if commodity.lower() in p["commodity_gu"].lower() or commodity.lower() in p.get("commodity", "").lower()]
        
    return prices
