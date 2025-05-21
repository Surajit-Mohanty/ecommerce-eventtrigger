// Replace with your Installed Package credentials
const CLIENT_ID = "s1hh28dpae2w0izh8fy2vpg0";
const CLIENT_SECRET = "vqkt3Sbz8Jl1ULwrH3pP95lp";
const AUTH_URL = "https://mcbpcpxtk6qzkpnzk1spgzn07rh0.auth.marketingcloudapis.com/";
const REST_URL = "https://mcbpcpxtk6qzkpnzk1spgzn07rh0.rest.marketingcloudapis.com/";
const DE_NAME = "TrackingEventsDE";

let accessToken = null;

async function getAccessToken() {
  if (accessToken) return accessToken;
  const response = await fetch(`${AUTH_URL}/v2/token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      grant_type: "client_credentials",
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET
    })
  });
  const data = await response.json();
  accessToken = data.access_token;
  return accessToken;
}

async function sendEvent(eventType, data = {}) {
  const token = await getAccessToken();
  const payload = {
    Email: localStorage.getItem("user_email"),
    Name: localStorage.getItem("user_name"),
    EventType: eventType,
    CartItems: JSON.stringify(data.cart || []),
    Timestamp: new Date().toISOString()
  };
  await fetch(`${REST_URL}/hub/v1/dataevents/key:${DE_NAME}/rowset`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ items: [payload] })
  });
}

function trackPageView(page) {
  sendEvent("PageView", { page });
}

function trackCart(cart) {
  sendEvent("CartUpdate", { cart });
}

function trackConversion(cart) {
  sendEvent("Conversion", { cart });
}

function trackWishlist(item) {
  sendEvent("Wishlist", { item });
}

function trackRating(productId, rating) {
  sendEvent("Rating", { productId, rating });
}

function trackEvent(customName, payload) {
  sendEvent(customName, payload);
}
