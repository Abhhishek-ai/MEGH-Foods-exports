# Megh Foods — Owner & Admin Operations Guide

Welcome to the **Megh Foods Self-Service Administration Portal**. This guide is designed for the business owner and operations team of Megh Overseas Pvt. Ltd. (Ahmedabad, India) to manage the entire online store, wholesale trade leads, product catalogue, pack sizes, inventory, customer orders, courier dispatch, and shipping rules without requiring any technical or developer intervention.

---

## Table of Contents
1. [Accessing the Admin Portal](#1-accessing-the-admin-portal)
2. [Product & Variant Management](#2-product--variant-management)
   - [Adding a New Product](#adding-a-new-product)
   - [Uploading Product Images (Automatic WebP Compression)](#uploading-product-images)
   - [Setting Up Pack Sizes & Multi-Currency Prices](#setting-up-pack-sizes--multi-currency-prices)
   - [Promotional Sale Prices](#promotional-sale-prices)
   - [Stock Status & Hiding Products](#stock-status--hiding-products)
   - [Bulk & Export Only Variants](#bulk--export-only-variants)
   - [Editing and Deleting Existing Products](#editing-and-deleting-existing-products)
3. [Category Management](#3-category-management)
4. [Order Fulfillment & Courier Dispatch](#4-order-fulfillment--courier-dispatch)
   - [Understanding Order Statuses](#understanding-order-statuses)
   - [Entering Courier Tracking (AWB)](#entering-courier-tracking-awb)
   - [Live Customer Order Tracking](#live-customer-order-tracking)
5. [Wholesale & Export Inquiries (B2B Leads)](#5-wholesale--export-inquiries-b2b-leads)
   - [Reviewing & Updating Inquiry Status](#reviewing--updating-inquiry-status)
   - [Exporting Inquiries to CSV](#exporting-inquiries-to-csv)
6. [Shipping Zones & Delivery Rates](#6-shipping-zones--delivery-rates)
   - [Adding / Editing Regional Shipping Zones](#adding--editing-regional-shipping-zones)
   - [Setting Free Shipping Thresholds](#setting-free-shipping-thresholds)
7. [Online Payment Safety Limits](#7-online-payment-safety-limits)
8. [Frequently Asked Questions & Troubleshooting](#8-frequently-asked-questions--troubleshooting)

---

## 1. Accessing the Admin Portal

- **Admin Login URL:** `https://your-domain.com/admin/login` (or `http://localhost:3000/admin/login` in development)
- **Direct Admin Dashboard:** `https://your-domain.com/admin`

### Logging In
1. Enter your registered administrative email address and password.
2. Click **Sign in to Dashboard**.
3. Once authenticated, your secure session is preserved, and you will be directed to the overview dashboard showing real-time statistics:
   - **Active Products** in your catalogue
   - **Recent Orders & Revenue** (INR & USD)
   - **Pending Wholesale Inquiries** requiring follow-up

### Logging Out
Click the **Sign Out** button located in the top navigation bar or sidebar of the admin console.

---

## 2. Product & Variant Management

All product operations are performed under **Products** (`/admin/products`).

### Adding a New Product
1. Navigate to **Products** and click the **+ Add Product** button in the top-right corner.
2. A sliding product editor panel will open. Fill out the following sections:
   - **Product Title:** Enter the full grocery name (e.g., `Rajgira Atta (Amaranth Flour)`, `Singhare Ka Atta (Water Chestnut Flour)`).
   - **URL Slug:** Auto-generated from the title, or customize it (e.g., `rajgira-atta`).
   - **Master SKU:** Unique identifier code (e.g., `MF-FL-001`).
   - **Category & Subcategory:** Select from your created categories (e.g., `Millet & Vrat Flours`), and optionally specify a subcategory (e.g., `Fasting Special`).
   - **Short Description:** A 1-2 sentence hook displayed on product cards and preview snippets.
   - **Full Description (Markdown):** Detailed description, culinary uses, traditional recipes, and milling heritage. You can use bolding, bullet points, and headers.
   - **Ingredients:** Comma-separated list of raw ingredients (e.g., `100% Pure Sifted Amaranth Grains`).
   - **Shelf Life:** e.g., `9 Months from Packaging Date`.
   - **Dietary Tags:** Enter badges separated by commas (e.g., `Vegan, Gluten-Free, Vrat Friendly, 100% Natural`).
   - **Nutrition Facts:** Key nutrition points per 100g (e.g., Energy: `370 kcal`, Protein: `14g`, Carbohydrates: `65g`, Dietary Fiber: `7g`).

### Uploading Product Images
1. Click or drag product photography into the **Product Images** dropzone.
2. **Automatic Optimization:** Images are automatically compressed inside your browser to modern `.webp` format at high visual fidelity before upload, saving bandwidth and guaranteeing lightning-fast storefront loading worldwide.
3. The **first image** in the gallery automatically acts as the primary cover card photo across the website.

### Setting Up Pack Sizes & Multi-Currency Prices
Every product can have multiple pack sizes (variants). For each pack size:
1. **Label:** e.g., `2 LBS`, `4 LBS`, `8 LBS`, `500g`, `1 kg`, `5 kg`.
2. **Net Weight (Grams):** e.g., `907` for 2 lbs, `1814` for 4 lbs.
3. **Variant SKU:** Unique identifier (e.g., `MF-FL-001-2LB`).
4. **Price (INR ₹):** The retail price charged to domestic Indian customers.
5. **Price (USD $):** The retail price charged to international customers in the USA, Europe, Middle East, and worldwide.

### Promotional Sale Prices
- To run a discount, simply fill in **Sale Price (INR)** and/or **Sale Price (USD)**.
- When filled, the storefront automatically crosses out the original price, highlights the discount pill, and charges the reduced sale price at checkout.
- To end a sale, clear the sale price fields.

### Stock Status & Hiding Products
- **In Stock:** Available for immediate purchase online.
- **Out of Stock:** Marked with an "Out of Stock" badge on the product page; the "Add to Cart" button is disabled to prevent backorders.
- **Made to Order:** Product is available to order but noted with special preparation lead time.
- **Active / Inactive Toggle:** Unchecking **"Active Product"** immediately hides the product completely from the storefront search and catalog without deleting historical order records.

### Bulk & Export Only Variants
For bulk institutional bags (e.g., `25 kg Bulk Bag`, `Pallet Load`, `FCL Container`):
- Check the **"Bulk / Export Only"** checkbox on that variant.
- **Storefront Behavior:** This variant will **not** allow direct online retail checkout. Instead, clicking this variant displays a prominent **"Request Wholesale Quotation"** button that opens a pre-filled B2B inquiry form specifying container volume, Incoterms (FOB/CIF), and target port.

---

## 3. Category Management

Navigate to **Categories** (`/admin/categories`) to organize your store taxonomy:
1. **Create Category:** Click **+ Add Category**. Provide the Name (e.g., `Sabudana & Poha`), unique Slug, and Sort Order index.
2. **Sort Order:** Controls the appearance order on the home page category grid and navigation bars. Lower numbers appear first (e.g., 1, 2, 3...).
3. **Active Toggle:** Quickly show or hide an entire category of goods.

---

## 4. Order Fulfillment & Courier Dispatch

Navigate to **Orders** (`/admin/orders`) to review customer purchases.

### Understanding Order Statuses
- **Payment Statuses:**
  - `pending`: Checkout initiated; customer hasn't completed payment or authorization is in-flight.
  - `paid`: Payment successfully captured and verified via Razorpay HMAC signature.
  - `failed`: Transaction failed at gateway or was cancelled by user.
  - `refunded`: Refund initiated and executed back to source account.
- **Fulfillment Statuses:**
  - `new`: Paid order awaiting warehouse handling.
  - `packed`: Warehouse team in Ahmedabad has packed and vacuum-sealed the parcel.
  - `shipped`: Handed over to logistics carrier (DHL, FedEx, India Post, etc.).
  - `delivered`: Parcel successfully delivered to the customer's international or domestic address.
  - `cancelled`: Order cancelled.

### Entering Courier Tracking (AWB)
1. Click on any order in the orders table to view the full **Order Detail** screen (`/admin/orders/[id]`).
2. Review the customer's shipping address and purchased item lines.
3. Once the package is packed and labeled:
   - In the **Update Order** panel, set the **Fulfillment Status** to `shipped`.
   - Enter the **Courier Partner** (e.g., `DHL Express`, `FedEx International`, `Blue Dart`, `India Post Speed Post`).
   - Enter the **Tracking Number / AWB** (e.g., `9400100000000000000000` or `1234567890`).
   - Click **Save Updates**.

### Live Customer Order Tracking
- The moment you save the tracking number and change status to `shipped`:
  1. An automated dispatch email is transmitted to the customer (via Resend) with courier details and direct link.
  2. The customer's secure live tracking page (`/order/MF-XXXX?t=<secret_token>`) instantly reflects the courier name, tracking number, and live status badge.

---

## 5. Wholesale & Export Inquiries (B2B Leads)

Navigate to **Inquiries** (`/admin/inquiries`) to review inbound leads from distributors, ethnic supermarket chains, and overseas importers.

### Reviewing & Updating Inquiry Status
1. Filter leads by status: **All**, **New**, **Contacted**, or **Closed**.
2. Filter by lead type: **Retail**, **B2B / Wholesale**, or **Export Shipment**.
3. View the prospective client's details:
   - Full Name, Business Name, Country, City
   - Email and Phone / WhatsApp number
   - Import License status (e.g., FDA registered, EU import license)
   - Estimated order volume (e.g., `20ft FCL Container`, `LCL Consolidated Cargo`, `5 Metric Tons`)
   - Product interest & customer message
4. After contacting the client via phone or email, update the lead status from `new` to `contacted` or `closed`.

### Exporting Inquiries to CSV
- Click the **Download CSV** button on the top right of the inquiries screen.
- A clean, UTF-8 CSV file named `megh-foods-inquiries-YYYY-MM-DD.csv` will download immediately, ready for import into Microsoft Excel, Google Sheets, or your CRM.

---

## 6. Shipping Zones & Delivery Rates

Navigate to **Shipping Zones** (`/admin/shipping`) to configure how delivery fees are calculated for retail checkout:
1. **Domestic Zone (India):** Pre-configured with flat rate INR and free shipping above a set basket threshold (e.g., Free delivery above ₹1,500).
2. **International Regional Zones (USA, UK & Europe, Middle East / GCC, Rest of World):**
   - **Rate (USD $):** Flat shipping fee added to parcel orders to that zone.
   - **Free Above (USD $):** Free shipping promotion threshold for qualifying cart sizes.
   - **Estimated Delivery Days:** e.g., `10-18 business days via DHL Air Express`.
   - **Country Codes:** ISO 2-letter country codes (e.g., `US, CA`, `GB, DE, FR, NL`, `AE, SA, QA, KW`).
3. Click **Edit** to modify rates at any time. Rate updates take effect immediately for all subsequent customer checkouts.

---

## 7. Online Payment Safety Limits

To protect against card fraud, credit limit chargebacks, and cross-border currency regulations:
- The website enforces a strict maximum threshold for online card checkout:
  - **Domestic:** Maximum ₹250,000 per order
  - **International:** Maximum $3,000 USD per order
- If a customer adds items exceeding these amounts, the checkout informs them that commercial-scale orders must be processed through an export invoice with container freight terms, and directs them to the B2B inquiry desk.

---

## 8. Frequently Asked Questions & Troubleshooting

### Q: A customer says they paid, but their order still shows "pending".
- The system automatically captures payments via Razorpay webhooks.
- If the customer's internet disconnected before returning to the website, the webhook will update the status within 1-2 minutes.
- If necessary, check your Razorpay Merchant Dashboard (`dashboard.razorpay.com`). If payment shows `Captured`, you can verify the payment ID directly in the Admin Order details.

### Q: How do I change the WhatsApp contact number shown on the website?
- Update the `NEXT_PUBLIC_WHATSAPP_NUMBER` environment variable in your Vercel deployment settings, or update it in `lib/config.ts`.

### Q: An international customer wants to pay in Euros or British Pounds.
- International checkout is denominated in **USD ($)**. Razorpay's international gateway automatically accepts all major Visa, MasterCard, and American Express cards worldwide and converts from EUR, GBP, AED, CAD, or AUD at the prevailing bank exchange rate.

### Q: Can I run a festive promotion or seasonal discount?
- Yes. Open `/admin/products`, select the items, and enter a **Sale Price**. The storefront will automatically display the discount tag. When the promotion concludes, simply remove the sale price.
