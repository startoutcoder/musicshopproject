package com.mymall.shoppingmall.config;

import com.mymall.shoppingmall.model.Category;
import com.mymall.shoppingmall.model.Product;
import com.mymall.shoppingmall.model.Track;
import com.mymall.shoppingmall.repository.CategoryRepository; // 1. Import CategoryRepository
import com.mymall.shoppingmall.repository.ProductRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@Profile("dev")
public class DataSeeder implements CommandLineRunner {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository; // 2. Inject CategoryRepository

    public DataSeeder(ProductRepository productRepository, CategoryRepository categoryRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        loadProductData();
    }

    private void loadProductData() {
        if (productRepository.count() == 0) {
            System.out.println("No data found, Seeding initial data...");

            Category rockCategory = createCategoryIfNotExists("Rock", "a broad genre of popular music...");
            Category jazzCategory = createCategoryIfNotExists("Jazz", "A music genre that originated in the African-American communities...");

            Product product1 = new Product();
            product1.setProductName("Our Hope");
            product1.setProductCategory(rockCategory); // Assign the saved category
            product1.setProductPrice(25.99);
            product1.setProductQuantity(10);
            product1.setArtistName("Hitsujibungaku");
            product1.setImageUrl("https://i.ytimg.com/vi/eUZbVZG1oqU/maxresdefault.jpg");
            product1.addTrack(new Track(1, "Hopi", "4:31", product1));
            product1.addTrack(new Track(2, "Hikaru Toki", "5:52", product1));
            product1.addTrack(new Track(3, "Party ha sugu soko", "3:36", product1));
            product1.addTrack(new Track(4, "Denpa no machi", "3:26", product1));
            product1.addTrack(new Track(5, "Kiniro", "4:41", product1));
            product1.addTrack(new Track(6, "Lucky", "2:41", product1));
            product1.addTrack(new Track(7, "Kudaranai", "3:36", product1));
            product1.addTrack(new Track(8, "Carol", "4:47", product1));
            product1.addTrack(new Track(9, "Wonder", "4:12", product1));
            product1.addTrack(new Track(10, "OOPARTS", "5:07", product1));
            product1.addTrack(new Track(11, "Mayoiga", "5:20", product1));
            product1.addTrack(new Track(12, "Yokan", "5:48", product1));

            Product product2 = new Product();
            product2.setProductName("To Be Kind");
            product2.setProductCategory(rockCategory); // FIXED: Set for product2
            product2.setProductPrice(34.99);
            product2.setProductQuantity(10);
            product2.setArtistName("Swans");
            product2.setImageUrl("https://www.joesalbums.com/cdn/shop/files/Swans-To-Be-Kind_30176a62-dd8e-435a-81e6-a52b1eed8149.jpg?v=1729716978&width=1500");

            product2.addTrack(new Track(1, "Screen shot", "8:05", product2));
            product2.addTrack(new Track(2, "Just a little Boy (For Chester Burnett) ", "12:40", product2));
            product2.addTrack(new Track(3, "A Little God in My Hands", "7:08", product2));
            product2.addTrack(new Track(4, "Bring the Sun / Toussaint L'Ouverture", "34:05", product2));
            product2.addTrack(new Track(5, "Some Things We Do", "5:09", product2));
            product2.addTrack(new Track(6, "She Loves Us", "17:01", product2));
            product2.addTrack(new Track(7, "Kirsten Supine", "10:32", product2));
            product2.addTrack(new Track(8, "Oxygen", "7:59", product2));
            product2.addTrack(new Track(9, "Nathalie Neal", "10:15", product2));
            product2.addTrack(new Track(10, "To Be Kind", "8:23", product2));


            Product product3 = new Product();
            product3.setProductName("Punisher");
            product3.setProductCategory(rockCategory); // FIXED: Set for product3
            product3.setProductPrice(29.99);
            product3.setProductQuantity(10);
            product3.setArtistName("Phoebe Bridgers");
            product3.setImageUrl("https://thesoundofvinyl.us/cdn/shop/files/punisher.png?v=1685637170");

            // 5. Save all products at once for efficiency.
            productRepository.saveAll(List.of(product1, product2, product3));

            System.out.println("Products have been seeded successfully.");

        } else {
            System.out.println("Products are already in the database!");
        }
    }

    private Category createCategoryIfNotExists(String name, String description) {
        return categoryRepository.findByCategoryName(name)
                .orElseGet(() -> {
                    System.out.println("Creating category: " + name);
                    Category newCategory = new Category(name, description);
                    return categoryRepository.save(newCategory);
                });
    }
}