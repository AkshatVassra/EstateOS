"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { PageBody, PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useProperties } from "@/hooks/useProperties";
import { formatCurrency } from "@/lib/utils";
import { Plus, Search, Filter, ArrowUpDown, Building2, Bed, Bath, Heart, Loader2 } from "lucide-react";

export default function PropertiesPage() {
  const [search, setSearch] = useState("");
  const { data: properties, isLoading, isError } = useProperties();

  const propertyList = Array.isArray(properties) ? properties : [];
  const filteredProperties = propertyList.filter((p: any) =>
    (p.title || "").toLowerCase().includes(search.toLowerCase()) ||
    (p.location || p.city || "").toLowerCase().includes(search.toLowerCase())
  );

  const getImageUrl = (p: any) => {
    if (Array.isArray(p.images) && p.images.length > 0) return p.images[0];
    if (typeof p.images === "string" && p.images.startsWith("http")) return p.images;
    return "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop&q=80";
  };

  return (
    <>
      <PageHeader
        title="Properties Inventory"
        description="Manage your active listings, upload new inventory, and let AI match them to VIP buyers."
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline">
              Import CSV
            </Button>
            <Button variant="accent">
              <Plus className="h-4 w-4 mr-2" />
              Upload Property
            </Button>
          </div>
        }
      />
      <PageBody>
        {/* Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search properties by title, location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
            <Button variant="outline">
              <ArrowUpDown className="h-4 w-4 mr-2" />
              Sort
            </Button>
          </div>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-accent" />
            <span className="ml-3 text-muted-foreground font-medium">Loading live property inventory...</span>
          </div>
        )}

        {isError && (
          <div className="p-6 rounded-xl border border-danger/20 bg-danger/5 text-danger text-center">
            <p className="font-semibold">Failed to load property listings.</p>
            <p className="text-sm mt-1">Please ensure the API server is running and connected.</p>
          </div>
        )}

        {!isLoading && !isError && (
          <>
            {/* Properties Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProperties.map((property: any) => (
                <Link
                  key={property.id}
                  href={`/properties/${property.id}`}
                  className="group"
                >
                  <Card className="overflow-hidden border-0 shadow-sm hover:shadow-xl transition-all duration-300 h-full">
                    <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                      <Image
                        src={getImageUrl(property)}
                        alt={property.title || "Property"}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute top-3 left-3 flex gap-2">
                        <Badge variant={property.status === "AVAILABLE" ? "success" : "secondary"}>
                          {property.status || "AVAILABLE"}
                        </Badge>
                      </div>
                      <button className="absolute top-3 right-3 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center text-muted-foreground hover:text-danger transition-colors">
                        <Heart className="h-4 w-4" />
                      </button>
                    </div>
                    <CardContent className="p-5">
                      <p className="text-2xl font-bold mb-2">
                        {formatCurrency(Number(property.price || 0), property.currency || "AED")}
                      </p>
                      <h3 className="text-lg font-semibold mb-2 group-hover:text-accent transition-colors line-clamp-1">
                        {property.title || "Luxury Residence"}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {property.location || property.city || "Dubai, UAE"}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground pt-4 border-t border-border">
                        <div className="flex items-center gap-1.5">
                          <Bed className="h-4 w-4" />
                          {property.bedrooms || 0} Beds
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Bath className="h-4 w-4" />
                          {property.bathrooms || 0} Baths
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Building2 className="h-4 w-4" />
                          {property.area || 0} sqft
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            {filteredProperties.length === 0 && (
              <div className="text-center py-20">
                <div className="h-20 w-20 rounded-3xl bg-muted/50 mx-auto flex items-center justify-center mb-4">
                  <Building2 className="h-10 w-10 text-muted-foreground" />
                </div>
                <p className="text-xl font-semibold text-foreground">No properties found</p>
                <p className="text-muted-foreground mt-2">No listings match your search in the live database.</p>
              </div>
            )}
          </>
        )}
      </PageBody>
    </>
  );
}