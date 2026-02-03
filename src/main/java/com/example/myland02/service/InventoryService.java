package com.example.myland02.service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.myland02.model.Ingredient;
import com.example.myland02.model.Production;
import com.example.myland02.model.ProductionIngredient;
import com.example.myland02.repository.IngredientRepository;

@Service
public class InventoryService {
    
    @Autowired
    private IngredientRepository ingredientRepository;
    
    public void reduceIngredientQuantities(Production production) {
        if (production.getUsedIngredients() != null && !production.getUsedIngredients().isEmpty()) {
            for (ProductionIngredient productionIngredient : production.getUsedIngredients()) {
                if (productionIngredient.getIngredient() != null) {
                    Ingredient ingredient = productionIngredient.getIngredient();
                    double quantityUsed = productionIngredient.getQuantityUsed();
                    
                    // Get current quantity from database
                    Ingredient currentIngredient = ingredientRepository.findById(ingredient.getId()).orElse(null);
                    if (currentIngredient != null) {
                        double currentQuantity = currentIngredient.getQuantity();
                        double newQuantity = Math.max(0, currentQuantity - quantityUsed);
                        
                        // Update the ingredient quantity
                        currentIngredient.setQuantity(newQuantity);
                        ingredientRepository.save(currentIngredient);
                        
                        System.out.println("Reduced " + ingredient.getName() + " by " + quantityUsed + 
                                         " units. New quantity: " + newQuantity);
                    }
                }
            }
        }
    }
    
    public void restoreIngredientQuantities(Production production) {
        if (production.getUsedIngredients() != null && !production.getUsedIngredients().isEmpty()) {
            for (ProductionIngredient productionIngredient : production.getUsedIngredients()) {
                if (productionIngredient.getIngredient() != null) {
                    Ingredient ingredient = productionIngredient.getIngredient();
                    double quantityUsed = productionIngredient.getQuantityUsed();
                    
                    // Get current quantity from database
                    Ingredient currentIngredient = ingredientRepository.findById(ingredient.getId()).orElse(null);
                    if (currentIngredient != null) {
                        double currentQuantity = currentIngredient.getQuantity();
                        double newQuantity = currentQuantity + quantityUsed;
                        
                        // Restore the ingredient quantity
                        currentIngredient.setQuantity(newQuantity);
                        ingredientRepository.save(currentIngredient);
                        
                        System.out.println("Restored " + ingredient.getName() + " by " + quantityUsed + 
                                         " units. New quantity: " + newQuantity);
                    }
                }
            }
        }
    }
}
