import { useState, useMemo } from "react";
import { Header } from "@/components/Header";
import { FilterSidebar } from "@/components/FilterSidebar";
import { ProductCard } from "@/components/ProductCard";
import { mockProducts } from "@/data/mockProducts";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([
    "amazon",
    "flipkart",
    "tira",
    "myntra",
  ]);

  const handlePlatformChange = (platform: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platform)
        ? prev.filter((p) => p !== platform)
        : [...prev, platform]
    );
  };

  const handleReset = () => {
    setPriceRange([0, 100000]);
    setSelectedPlatforms(["amazon", "flipkart", "tira", "myntra"]);
    setSearchQuery("");
  };

  const filteredProducts = useMemo(() => {
    return mockProducts.filter((product) => {
      // Search filter
      const matchesSearch =
        searchQuery === "" ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase());

      // Price filter (check if any price from selected platforms falls within range)
      const availablePrices = product.prices.filter(
        (p) => p.inStock && selectedPlatforms.includes(p.platform)
      );

      const matchesPrice =
        availablePrices.length > 0 &&
        availablePrices.some(
          (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
        );

      return matchesSearch && matchesPrice;
    });
  }, [searchQuery, priceRange, selectedPlatforms]);

  return (
    <div className="min-h-screen bg-background">
      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <main className="container px-4 md:px-6 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Find the Best Deals</h2>
          <p className="text-muted-foreground">
            Compare prices across Amazon, Flipkart, Tira, and Myntra in seconds
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <FilterSidebar
            priceRange={priceRange}
            onPriceRangeChange={setPriceRange}
            selectedPlatforms={selectedPlatforms}
            onPlatformChange={handlePlatformChange}
            onReset={handleReset}
          />

          <div className="flex-1">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">
                  No products found matching your filters
                </p>
              </div>
            ) : (
              <>
                <div className="mb-4 text-sm text-muted-foreground">
                  Showing {filteredProducts.length} product
                  {filteredProducts.length !== 1 ? "s" : ""}
                </div>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
