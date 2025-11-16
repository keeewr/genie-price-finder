import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

interface FilterSidebarProps {
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  selectedPlatforms: string[];
  onPlatformChange: (platform: string) => void;
  onReset: () => void;
}

const platforms = [
  { id: "amazon", name: "Amazon" },
  { id: "flipkart", name: "Flipkart" },
  { id: "tira", name: "Tira" },
  { id: "myntra", name: "Myntra" },
];

export const FilterSidebar = ({
  priceRange,
  onPriceRangeChange,
  selectedPlatforms,
  onPlatformChange,
  onReset,
}: FilterSidebarProps) => {
  return (
    <aside className="w-full md:w-64 space-y-6">
      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Filters</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="h-8 px-2"
          >
            <RotateCcw className="h-4 w-4 mr-1" />
            Reset
          </Button>
        </div>

        <div className="space-y-6">
          <div>
            <Label className="text-sm font-medium mb-4 block">
              Price Range
            </Label>
            <div className="space-y-4">
              <Slider
                min={0}
                max={100000}
                step={1000}
                value={priceRange}
                onValueChange={(value) =>
                  onPriceRangeChange(value as [number, number])
                }
                className="mt-2"
              />
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>₹{priceRange[0].toLocaleString()}</span>
                <span>₹{priceRange[1].toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium mb-3 block">Platforms</Label>
            <div className="space-y-3">
              {platforms.map((platform) => (
                <div key={platform.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={platform.id}
                    checked={selectedPlatforms.includes(platform.id)}
                    onCheckedChange={() => onPlatformChange(platform.id)}
                  />
                  <Label
                    htmlFor={platform.id}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {platform.name}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
