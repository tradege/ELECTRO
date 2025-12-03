# Electro Marketplace TODO

## Database Schema
- [x] Create stores table with store information
- [x] Create products table with product details and store relationships
- [x] Create categories table for product organization
- [x] Create cart table for shopping cart items
- [x] Create orders table for order management
- [x] Create order_items table for order details

## Backend API (tRPC)
- [x] Implement store procedures (list, get by id)
- [x] Implement product procedures (list, get by id, filter by category/store)
- [x] Implement cart procedures (add, remove, update quantity, get cart)
- [x] Implement order procedures (create, list user orders, get order details)
- [x] Implement category procedures (list categories)
- [x] Add admin procedures for store management
- [x] Add admin procedures for product management

## Frontend - Nike-Inspired Design
- [x] Design and implement homepage with hero section
- [x] Create product grid layout with filters
- [x] Build individual product detail pages
- [x] Create store listing and store detail pages
- [x] Implement category navigation
- [ ] Add search functionality

## Shopping Cart & Checkout
- [x] Build shopping cart UI with item management
- [x] Implement cart badge in navigation
- [x] Create checkout flow
- [x] Add order confirmation page

## User Features
- [x] Create user dashboard
- [x] Implement order history page
- [x] Add order tracking functionality

## Admin Panel
- [x] Build admin dashboard layout
- [x] Create store management interface
- [x] Create product management interface (add, edit, delete)
- [x] Add order management for admins

## Testing & Polish
- [ ] Write vitest tests for critical procedures
- [ ] Test all user flows
- [ ] Ensure responsive design on mobile and desktop
- [ ] Performance optimization

## Game System (Tree or Leaf)
- [x] Create game_sessions table to track user game attempts
- [x] Create game_results table to store individual game plays
- [x] Create prize_codes table for winner redemption codes
- [x] Add game pricing logic (10% of product price)
- [x] Implement Tree or Leaf game logic with 45% win rate
- [x] Build animated game interface with visual feedback
- [x] Create payment packages (1 attempt vs 4 attempts)
- [x] Add win counter system (need 5 wins to get product)
- [x] Generate unique prize codes for winners
- [x] Create prize code redemption system
- [x] Add game history for users
- [x] Update product pages with "Play to Win" option
- [ ] Admin dashboard for game statistics and prize codes

## Game System Improvements
- [x] Pre-generate random results when user pays (prevent cheating)
- [x] Store pre-generated results in database
- [x] Move game to homepage (visible to everyone)
- [x] Update game logic to use pre-generated results
- [x] Ensure each payment gets unique random sequence

## Interactive Demo Game on Homepage
- [x] Create demo game component that runs on homepage
- [x] Allow everyone to play for free (no login required)
- [x] Add visual feedback and animations
- [x] Show "Play for Real" button after demo
- [x] Distinguish between demo mode and paid mode

## Game Design Improvements
- [x] Redesign game with Nike-inspired styling (black/white/orange colors)
- [x] Fix win rate display (currently shows 100% win, should be 45%)
- [x] Add clear animation showing draw result (tree or leaf)
- [x] Show clear "Won" or "Lost" message after each round
- [x] Match game design to overall website aesthetic
