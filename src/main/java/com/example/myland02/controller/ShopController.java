package com.example.myland02.controller;

import com.example.myland02.model.Shop;
import com.example.myland02.service.ShopService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/shops")
@CrossOrigin(origins = "*")
public class ShopController {

    @Autowired
    private ShopService shopService;

    @GetMapping
    public List<Shop> getAllShops() {
        return shopService.getAllShops();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Shop> getShopById(@PathVariable Long id) {
        return shopService.getShopById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Shop createShop(@RequestBody Shop shop) {
        return shopService.saveShop(shop);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Shop> updateShop(@PathVariable Long id, @RequestBody Shop shopDetails) {
        return shopService.getShopById(id)
                .map(shop -> {
                    shop.setName(shopDetails.getName());
                    shop.setAddress(shopDetails.getAddress());
                    shop.setContactNumber(shopDetails.getContactNumber());
                    shop.setEmail(shopDetails.getEmail());
                    return ResponseEntity.ok(shopService.saveShop(shop));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteShop(@PathVariable Long id) {
        shopService.deleteShop(id);
        return ResponseEntity.ok().build();
    }
}