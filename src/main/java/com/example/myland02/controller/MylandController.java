package com.example.myland02.controller;
import com.example.myland02.model.Ingredient;
import com.example.myland02.model.Product;
import com.example.myland02.model.Sale;
import com.example.myland02.model.Shop;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;
import com.example.myland02.model.*;
import com.example.myland02.repository.*;
import com.example.myland02.dto.ProductionRequest;
import com.example.myland02.dto.ProductionIngredientRequest;

import java.util.List;

@RestController
@RequestMapping("/api")
public class MylandController {
    @Autowired private ProductRepository productRepo;
    @Autowired private IngredientRepository ingredientRepo;
    @Autowired private SaleRepository saleRepo;
    @Autowired private ProductionRepository prodRepo;
    @Autowired private ProductionIngredientRepository productionIngredientRepo;
    @Autowired private ShopRepository shopRepo;

    @PostMapping("/product")
    public Product addProduct(@RequestBody Product product) {
        System.out.println("Saving product: " + product.getName() + ", basePrice: " + product.getBasePrice());
        return productRepo.save(product);
    }
    @PostMapping("/ingredient")
    public Ingredient addIngredient(@RequestBody Ingredient i) { return ingredientRepo.save(i); }
    @PostMapping("/production")
    @Transactional
    public Production recordProduction(@RequestBody ProductionRequest request) { 
        System.out.println("=== PRODUCTION REQUEST RECEIVED ===");
        System.out.println("Product: " + (request.getProduct() != null ? request.getProduct().getName() : "NULL"));
        System.out.println("Produced Units: " + request.getProducedUnits());
        System.out.println("Used Ingredients Count: " + (request.getUsedIngredients() != null ? request.getUsedIngredients().size() : 0));
        
        // Validate ingredient availability BEFORE creating production record
        if (request.getUsedIngredients() != null && !request.getUsedIngredients().isEmpty()) {
            System.out.println("Validating ingredient availability...");
            
            for (ProductionIngredientRequest piRequest : request.getUsedIngredients()) {
                Ingredient ingredient = ingredientRepo.findById(piRequest.getIngredientId()).orElse(null);
                if (ingredient == null) {
                    throw new RuntimeException("Ingredient with ID " + piRequest.getIngredientId() + " not found!");
                }
                
                double requiredQuantity = piRequest.getQuantityUsed();
                double availableQuantity = ingredient.getQuantity();
                
                if (availableQuantity < requiredQuantity) {
                    String errorMsg = String.format(
                        "Insufficient stock for ingredient '%s'. Required: %.2f, Available: %.2f",
                        ingredient.getName(), requiredQuantity, availableQuantity
                    );
                    System.out.println("ERROR: " + errorMsg);
                    throw new RuntimeException(errorMsg);
                }
                
                System.out.println("✓ Ingredient '" + ingredient.getName() + "' has sufficient stock: " + availableQuantity + " >= " + requiredQuantity);
            }
            System.out.println("All ingredients validated successfully!");
        }
        
        // Create the production record
        Production production = new Production();
        production.setProduct(request.getProduct());
        production.setDate(request.getDate());
        production.setProducedUnits(request.getProducedUnits());
        
        Production savedProduction = prodRepo.save(production);
        System.out.println("Production saved with ID: " + savedProduction.getId());
        
        // Save ProductionIngredient entities and reduce ingredient quantities
        if (request.getUsedIngredients() != null && !request.getUsedIngredients().isEmpty()) {
            System.out.println("Processing " + request.getUsedIngredients().size() + " ingredients...");
            
            for (ProductionIngredientRequest piRequest : request.getUsedIngredients()) {
                System.out.println("Processing ingredient ID: " + piRequest.getIngredientId() + ", Quantity: " + piRequest.getQuantityUsed());
                
                // Find the ingredient
                Ingredient ingredient = ingredientRepo.findById(piRequest.getIngredientId()).orElse(null);
                if (ingredient == null) {
                    System.out.println("ERROR: Ingredient with ID " + piRequest.getIngredientId() + " not found!");
                    continue;
                }
                
                System.out.println("Found ingredient: " + ingredient.getName() + ", Current quantity: " + ingredient.getQuantity());
                
                // Save the production ingredient
                ProductionIngredient pi = new ProductionIngredient();
                pi.setProduction(savedProduction);
                pi.setIngredient(ingredient);
                pi.setQuantityUsed(piRequest.getQuantityUsed());
                productionIngredientRepo.save(pi);
                System.out.println("ProductionIngredient saved");
                
                // Reduce ingredient quantity directly
                double quantityUsed = piRequest.getQuantityUsed();
                double currentQuantity = ingredient.getQuantity();
                double newQuantity = Math.max(0, currentQuantity - quantityUsed);
                
                System.out.println("Reducing " + ingredient.getName() + " by " + quantityUsed + 
                                 " units. From " + currentQuantity + " to " + newQuantity);
                
                ingredient.setQuantity(newQuantity);
                ingredientRepo.save(ingredient);
                
                System.out.println("SUCCESS: Reduced " + ingredient.getName() + " by " + quantityUsed + 
                                 " units. New quantity: " + newQuantity);
            }
        } else {
            System.out.println("WARNING: No used ingredients found in request!");
        }
        
        System.out.println("=== PRODUCTION PROCESSING COMPLETE ===");
        return savedProduction;
    }
    @PostMapping("/sale")
    public Sale recordSale(@RequestBody Sale s) { return saleRepo.save(s); }
    @PostMapping("/shop")
    public Shop addShop(@RequestBody Shop shop) { return shopRepo.save(shop); }
    
    // DELETE endpoints
    @DeleteMapping("/product/{id}")
    public void deleteProduct(@PathVariable Long id) { productRepo.deleteById(id); }
    
    @DeleteMapping("/ingredient/{id}")
    public void deleteIngredient(@PathVariable Long id) { ingredientRepo.deleteById(id); }
    
    @DeleteMapping("/production/{id}")
    public void deleteProduction(@PathVariable Long id) { prodRepo.deleteById(id); }
    
    @DeleteMapping("/sale/{id}")
    public void deleteSale(@PathVariable Long id) { saleRepo.deleteById(id); }
    
    @DeleteMapping("/shop/{id}")
    public void deleteShop(@PathVariable Long id) { shopRepo.deleteById(id); }
}
