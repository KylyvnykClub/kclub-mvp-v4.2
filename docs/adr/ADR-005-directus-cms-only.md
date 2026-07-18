# ADR-005: Directus Is CMS-Only

Status: Accepted

Directus manages public content, translations, SEO metadata, FAQ, legal documents, and media. It is isolated from core-domain data by separate database/schema and credentials. Cards, memberships, payments, staff, permissions, partner approval, and audit remain product-core concerns.
