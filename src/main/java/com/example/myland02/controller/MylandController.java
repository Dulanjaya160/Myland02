package com.example.myland02.controller;

import com.example.myland02.model.*;
import com.example.myland02.repository.*;
import com.example.myland02.dto.ProductionRequest;
import com.example.myland02.dto.ProductionIngredientRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import java.util.List;

@RestController
@RequestMapping("/api/myland") // Changed from "/api" to "/api/myland"
public class MylandController {
    @Autowired
    private ProductRepository productRepo;
    @Autowired
    private IngredientRepository ingredientRepo;
    @Autowired
    private SaleRepository saleRepo;
    @Autowired
    private ProductionRepository prodRepo;
    @Autowired
    private ProductionIngredientRepository productionIngredientRepo;
    @Autowired
    private ShopRepository shopRepo;

    // Product endpoints
    @PostMapping("/product")
    @Transactional
    public ResponseEntity<?> addProduct(@RequestBody Product product) {
        try {
            System.out.println("Saving product: " + product.getName());
            Product saved = productRepo.save(product);
            System.out.println("✓ Product saved with ID: " + saved.getId());
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            System.err.println("✗ Error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(java.util.Map.of("error", "Error saving product: " + e.getMessage()));
        }
    }

    @GetMapping("/products")
    public ResponseEntity<?> getProducts() {
        try {
            return ResponseEntity.ok(productRepo.findAll());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(java.util.Map.of("error", "Error loading products: " + e.getMessage()));
        }
    }

    @DeleteMapping("/product/{id}")
    @Transactional
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        try {
            productRepo.deleteById(id);
            return ResponseEntity.ok("Deleted");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(java.util.Map.of("error", "Error deleting product: " + e.getMessage()));
        }
    }

    // Ingredient endpoints
    // Ingredient endpoints -> MOVED to IngredientController.java
    // Keeping this comment as a placeholder

    // Shop endpoints
    @PostMapping("/shop")
    @Transactional
    public ResponseEntity<?> addShop(@RequestBody Shop shop) {
        try {
            System.out.println("DEBUG: Received shop save request");
            System.out.println("DEBUG: ID: " + shop.getId());
            System.out.println("DEBUG: Name: " + shop.getName());

            Shop saved = shopRepo.save(shop);
            System.out.println("✓ Shop saved with ID: " + saved.getId());
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(java.util.Map.of("error", "Error saving shop: " + e.getMessage()));
        }
    }

    @GetMapping("/shops")
    public ResponseEntity<?> getShops() {
        return ResponseEntity.ok(shopRepo.findAll());
    }

    @DeleteMapping("/shop/{id}")
    @Transactional
    public ResponseEntity<?> deleteShop(@PathVariable Long id) {
        try {
            shopRepo.deleteById(id);
            return ResponseEntity.ok("Deleted");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(java.util.Map.of("error", "Error deleting shop: " + e.getMessage()));
        }
    }

    // Production endpoints -> MOVED to ProductionController.java
    // Keeping this comment as a placeholder

    // Sale endpoints
    @PostMapping("/sale")
    @Transactional
    public ResponseEntity<?> recordSale(@RequestBody Sale sale) {
        try {
            // Fetch validation and price data from Product
            if (sale.getProduct() == null || sale.getProduct().getId() == null) {
                return ResponseEntity.badRequest().body(java.util.Map.of("error", "Product ID is required"));
            }

            Product product = productRepo.findById(sale.getProduct().getId())
                    .orElseThrow(() -> new RuntimeException("Product not found"));

            // Set the full product reference (good practice)
            sale.setProduct(product);

            // Calculate Income and Profit
            // Net Units = Sold - Returned
            int soldUnits = sale.getSoldUnits() != null ? sale.getSoldUnits() : 0;
            int returnedUnits = sale.getReturnedUnits() != null ? sale.getReturnedUnits() : 0;
            int netUnits = soldUnits - returnedUnits;

            if (netUnits < 0)
                netUnits = 0; // preventative

            Double sellingPrice = product.getSellingPrice() != null ? product.getSellingPrice() : 0.0;
            Double productCost = product.getProductCost() != null ? product.getProductCost() : 0.0;

            double totalIncome = netUnits * sellingPrice;
            double totalProfit = netUnits * (sellingPrice - productCost);

            sale.setTotalIncome(totalIncome);
            sale.setTotalProfit(totalProfit);

            Sale saved = saleRepo.save(sale);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            e.printStackTrace(); // Log the error for debugging
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(java.util.Map.of("error", "Error recording sale: " + e.getMessage()));
        }
    }

    @GetMapping("/sales")
    public ResponseEntity<?> getSales() {
        return ResponseEntity.ok(saleRepo.findAll());
    }

    @DeleteMapping("/sale/{id}")
    @Transactional
    public ResponseEntity<?> deleteSale(@PathVariable Long id) {
        try {
            saleRepo.deleteById(id);
            return ResponseEntity.ok("Deleted");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(java.util.Map.of("error", "Error deleting sale: " + e.getMessage()));
        }
    }
}