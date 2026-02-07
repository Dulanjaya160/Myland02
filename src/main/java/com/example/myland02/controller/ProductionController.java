package com.example.myland02.controller;

import com.example.myland02.dto.ProductionIngredientRequest;
import com.example.myland02.dto.ProductionRequest;
import com.example.myland02.model.Ingredient;
import com.example.myland02.model.Product;
import com.example.myland02.model.Production;
import com.example.myland02.model.ProductionIngredient;
import com.example.myland02.repository.IngredientRepository;
import com.example.myland02.repository.ProductRepository;
import com.example.myland02.repository.ProductionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/myland")
@CrossOrigin(origins = "*")
public class ProductionController {

    @Autowired
    private ProductionRepository prodRepo;

    @Autowired
    private ProductRepository productRepo;

    @Autowired
    private IngredientRepository ingredientRepo;

    @PostMapping("/production")
    @Transactional
    public ResponseEntity<?> recordProduction(@RequestBody ProductionRequest request) {
        try {
            System.out.println("DEBUG: Received production request");

            // Validate product
            if (request.getProduct() == null || request.getProduct().getId() == null) {
                return ResponseEntity.badRequest().body("Product is required");
            }

            // Create Production entity
            Production production = new Production();
            production.setProduct(request.getProduct());
            production.setDate(request.getDate());
            production.setProducedUnits(request.getProducedUnits());
            production.setUsedIngredients(new ArrayList<>());

            // Process ingredients
            if (request.getUsedIngredients() != null) {
                for (ProductionIngredientRequest ingReq : request.getUsedIngredients()) {
                    Ingredient ingredient = ingredientRepo.findById(ingReq.getIngredientId())
                            .orElseThrow(
                                    () -> new RuntimeException("Ingredient not found: " + ingReq.getIngredientId()));

                    // Check stock
                    if (ingredient.getQuantity() < ingReq.getQuantityUsed()) {
                        return ResponseEntity.badRequest()
                                .body("Insufficient stock for ingredient: " + ingredient.getName());
                    }

                    // Deduct stock
                    ingredient.setQuantity(ingredient.getQuantity() - ingReq.getQuantityUsed());
                    ingredientRepo.save(ingredient);
                    System.out.println("DEBUG: Updated stock for " + ingredient.getName());

                    // Create link
                    ProductionIngredient pi = new ProductionIngredient();
                    pi.setProduction(production);
                    pi.setIngredient(ingredient);
                    pi.setQuantityUsed(ingReq.getQuantityUsed());

                    production.getUsedIngredients().add(pi);
                }
            }

            Production saved = prodRepo.save(production);
            System.out.println("✓ Production saved with ID: " + saved.getId());
            return ResponseEntity.ok(saved);

        } catch (Exception e) {
            System.err.println("✗ Error recording production: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error recording production: " + e.getMessage());
        }
    }

    @GetMapping("/production")
    public ResponseEntity<?> getProduction() {
        try {
            return ResponseEntity.ok(prodRepo.findAll());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error: " + e.getMessage());
        }
    }

    @DeleteMapping("/production/{id}")
    @Transactional
    public ResponseEntity<?> deleteProduction(@PathVariable Long id) {
        try {
            // Optional: Logic to restore ingredient stock could go here
            prodRepo.deleteById(id);
            return ResponseEntity.ok("Deleted");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error: " + e.getMessage());
        }
    }
}
