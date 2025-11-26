# Backend API Requirements for Marketplace, Pet Details, and Contact Seller Pages

## Overview
This document outlines the required fields and API endpoints needed from the backend for the Marketplace page, Pet Details page, and Contact Seller page.

---

## 1. Marketplace Page API

### Endpoint
```
GET /marketplace/listings
```

### Expected Response Format
```json
{
  "success": true,
  "data": {
    "listings": [
      {
        // Pet listing object (see fields below)
      }
    ]
  }
}
```

### Required Fields for Each Listing

| Field Name | Type | Required | Description | Example |
|------------|------|----------|-------------|---------|
| `id` | string/number | ✅ Yes | Unique identifier for the pet listing | `"1"` or `1` |
| `name` | string | ✅ Yes | Name of the pet | `"Golden Retriever Puppy"` |
| `breed` | string | ✅ Yes | Breed of the pet | `"Golden Retriever"` |
| `age` | string | ✅ Yes | Age of the pet (formatted string) | `"2 months"` |
| `price` | string | ✅ Yes | Price of the pet (formatted string) | `"Rs. 45,000"` |
| `description` | string | ✅ Yes | Short description of the pet | `"Adorable golden retriever puppy..."` |
| `image_url` | string | ✅ Yes | URL or path to the main pet image | `"/images/pets/cat-1.jpg"` or full URL |
| `verified` | boolean | ✅ Yes | Whether the listing is verified | `true` or `false` |
| `seller` | string | ✅ Yes | Name of the seller | `"Ahmed Khan"` |
| `rating` | string/number | ✅ Yes | Seller rating (can be string or number) | `"4.8"` or `4.8` |
| `location` | string | ✅ Yes | Location of the seller/pet | `"Karachi, Pakistan"` |
| `features` | array of strings | ✅ Yes | Array of pet features/tags | `["Vaccinated", "Health Certificate", "Playful", "Friendly"]` |
| `contact` | string | ⚠️ Optional | Seller contact phone number | `"+92 300 1234567"` |
| `email` | string | ⚠️ Optional | Seller email address | `"ahmed.khan@example.com"` |

### Notes for Marketplace Page:
- The `image_url` field should be a relative path (e.g., `/images/pets/pet1.jpg`) or a full URL. The frontend will prepend the API base URL if needed.
- The `price` field is displayed as-is, so format it appropriately (e.g., "Rs. 45,000").
- The `features` field must be an array, even if empty. If empty, the frontend will show "No features listed".
- The `rating` field can be a string or number, but will be displayed as-is.

---

## 2. Pet Details Page API

### Endpoint
```
GET /marketplace/listings/:id
```

### Expected Response Format
```json
{
  "success": true,
  "data": {
    "listing": {
      // Pet listing object (see fields below)
    }
  }
}
```

### Required Fields for Pet Details

All fields from the Marketplace listing are required, plus the following additional fields:

| Field Name | Type | Required | Description | Example |
|------------|------|----------|-------------|---------|
| `fullDescription` | string | ⚠️ Optional | Extended detailed description of the pet | `"This beautiful Golden Retriever puppy..."` |
| `healthInfo` | string | ⚠️ Optional | Health information about the pet | `"All vaccinations up to date, dewormed, health certificate provided"` |
| `additionalImages` | array of strings | ⚠️ Optional | Array of additional image URLs/paths | `["/images/pets/pet1-2.jpg", "/images/pets/pet1-3.jpg"]` |

### Complete Field List for Pet Details

**Required Fields:**
- `id` (string/number)
- `name` (string)
- `breed` (string)
- `age` (string)
- `price` (string)
- `description` (string)
- `image_url` (string)
- `verified` (boolean)
- `seller` (string)
- `rating` (string/number)
- `location` (string)
- `features` (array of strings)
- `contact` (string)
- `email` (string)

**Optional Fields (but recommended):**
- `fullDescription` (string) - Falls back to `description` if not provided
- `healthInfo` (string) - Falls back to "All vaccinations up to date" if not provided
- `additionalImages` (array of strings) - Array of image URLs/paths for gallery view

### Notes for Pet Details Page:
- If `fullDescription` is not provided, the page will use `description` instead.
- If `healthInfo` is not provided, the page will display "All vaccinations up to date" as default.
- If `additionalImages` is not provided or empty, only the main `image_url` will be displayed.
- The `additionalImages` array should contain image URLs/paths (relative or absolute).

---

## 3. Contact Seller Page API

### Endpoint 1: Get Pet Listing (Same as Pet Details)
```
GET /marketplace/listings/:id
```

**Note:** This endpoint is the same as the Pet Details page endpoint. The Contact Seller page uses the same pet listing data to display pet summary and seller information.

### Endpoint 2: Submit Contact Form
```
POST /marketplace/listings/:id/contact
```

### Request Body Format
```json
{
  "name": "Buyer's Name",
  "email": "buyer@example.com",
  "phone": "+92 300 1234567",
  "message": "I'm interested in this pet..."
}
```

### Required Request Fields

| Field Name | Type | Required | Description | Example |
|------------|------|----------|-------------|---------|
| `name` | string | ✅ Yes | Buyer's full name | `"John Doe"` |
| `email` | string | ✅ Yes | Buyer's email address | `"john.doe@example.com"` |
| `phone` | string | ✅ Yes | Buyer's phone number | `"+92 300 1234567"` |
| `message` | string | ✅ Yes | Message to the seller | `"I'm interested in this pet..."` |

### Expected Response Format (Success)
```json
{
  "success": true,
  "message": "Message sent successfully",
  "data": {
    "contactId": "123",
    "sentAt": "2024-01-15T10:30:00Z"
  }
}
```

### Expected Response Format (Error)
```json
{
  "success": false,
  "message": "Failed to send message",
  "error": "Detailed error information"
}
```

### Notes for Contact Seller Page:
- The page displays the same pet listing information as the Pet Details page
- The `contact` and `email` fields from the pet listing are required for the Contact Seller page to display seller contact information
- The form submission should send an email/notification to the seller
- The frontend expects a success response to show a confirmation message
- The pet listing ID is passed as a URL parameter (`:id`)

---

## 4. Data Type Specifications

### Price Format
- The `price` field should be a formatted string (e.g., "Rs. 45,000" or "$500")
- The frontend extracts numeric values for filtering, so ensure the format is consistent

### Image URLs
- Can be relative paths (e.g., `/images/pets/pet1.jpg`) or full URLs
- Relative paths will be prepended with the API base URL
- Ensure images are accessible via the provided URLs

### Features Array
- Must always be an array type
- Can be an empty array `[]` if no features
- Each element should be a string

### Rating
- Can be provided as a string (e.g., "4.8") or number (e.g., 4.8)
- Will be displayed as-is in the UI

---

## 5. Error Handling

### Marketplace Endpoint Errors
If the API call fails or returns an error, the frontend will:
- Display an empty listings array
- Show "No listings found matching your filters" message

### Pet Details Endpoint Errors
If the API call fails or the pet is not found, the frontend will:
- Redirect the user back to the marketplace page

### Contact Seller Endpoint Errors
If the GET request fails, the frontend will:
- Redirect the user back to the marketplace page

If the POST request fails, the frontend will:
- Display an error message to the user
- Allow the user to retry submitting the form

### Recommended Error Response Format
```json
{
  "success": false,
  "message": "Error message here",
  "error": "Detailed error information"
}
```

---

## 6. Example Complete Response

### Marketplace Response Example
```json
{
  "success": true,
  "data": {
    "listings": [
      {
        "id": "1",
        "name": "Golden Retriever Puppy",
        "breed": "Golden Retriever",
        "age": "2 months",
        "price": "Rs. 45,000",
        "description": "Adorable golden retriever puppy, fully vaccinated and healthy. Very playful and friendly.",
        "image_url": "/images/pets/golden-retriever-1.jpg",
        "verified": true,
        "seller": "Ahmed Khan",
        "rating": "4.8",
        "location": "Karachi, Pakistan",
        "features": ["Vaccinated", "Health Certificate", "Playful", "Friendly"],
        "contact": "+92 300 1234567",
        "email": "ahmed.khan@example.com"
      }
    ]
  }
}
```

### Pet Details Response Example
```json
{
  "success": true,
  "data": {
    "listing": {
      "id": "1",
      "name": "Golden Retriever Puppy",
      "breed": "Golden Retriever",
      "age": "2 months",
      "price": "Rs. 45,000",
      "description": "Adorable golden retriever puppy, fully vaccinated and healthy. Very playful and friendly.",
      "image_url": "/images/pets/golden-retriever-1.jpg",
      "verified": true,
      "seller": "Ahmed Khan",
      "rating": "4.8",
      "location": "Karachi, Pakistan",
      "features": ["Vaccinated", "Health Certificate", "Playful", "Friendly"],
      "contact": "+92 300 1234567",
      "email": "ahmed.khan@example.com",
      "fullDescription": "This beautiful Golden Retriever puppy is the perfect addition to any family. Born from champion bloodlines, this pup has been raised with love and care. The puppy has received all necessary vaccinations and comes with complete health documentation.",
      "healthInfo": "All vaccinations up to date, dewormed, health certificate provided",
      "additionalImages": [
        "/images/pets/golden-retriever-2.jpg",
        "/images/pets/golden-retriever-3.jpg"
      ]
    }
  }
}
```

### Contact Seller Response Example (Success)
```json
{
  "success": true,
  "message": "Your message has been sent to Ahmed Khan. They will get back to you soon.",
  "data": {
    "contactId": "contact_123",
    "sentAt": "2024-01-15T10:30:00Z"
  }
}
```

### Contact Seller Response Example (Error)
```json
{
  "success": false,
  "message": "Failed to send message. Please try again later.",
  "error": "Email service temporarily unavailable"
}
```

---

## 7. Summary Checklist

### Marketplace Page Requirements:
- ✅ Endpoint: `GET /marketplace/listings`
- ✅ Returns array of listings in `data.listings`
- ✅ Each listing must have: id, name, breed, age, price, description, image_url, verified, seller, rating, location, features
- ✅ Optional: contact, email

### Pet Details Page Requirements:
- ✅ Endpoint: `GET /marketplace/listings/:id`
- ✅ Returns single listing in `data.listing`
- ✅ All marketplace fields required
- ✅ Additional optional fields: fullDescription, healthInfo, additionalImages

### Contact Seller Page Requirements:
- ✅ Endpoint 1: `GET /marketplace/listings/:id` (same as Pet Details)
- ✅ Endpoint 2: `POST /marketplace/listings/:id/contact`
- ✅ Request body: name, email, phone, message (all required)
- ✅ Returns success/error response with message
- ✅ Pet listing must include: contact, email (required for this page)

---

## Questions or Clarifications?

If you need any clarification on these requirements, please reach out to the frontend team.

