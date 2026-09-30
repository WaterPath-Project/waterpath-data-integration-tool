declare module "*.riv" {
    const value: any; // Add better type definitions here if desired.
    export default value;
}

declare module "georaster" {
    import type { GeoRaster } from "georaster-layer-for-leaflet";
    /** Parses a GeoTIFF (ArrayBuffer or URL) into a GeoRaster usable by georaster-layer-for-leaflet. */
    export default function parseGeoraster(
        input: ArrayBuffer | string | Record<string, unknown>,
    ): Promise<GeoRaster & { noDataValue?: number | null }>;
}
