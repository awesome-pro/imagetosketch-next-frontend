export enum SketchStatus {
    PENDING = "pending",
    PROCESSING = "processing",
    COMPLETED = "completed",
    FAILED = "failed",
}

export enum SketchType {
    BLACK_AND_WHITE = "black_and_white",
    COLOR = "color",
}

export enum SketchStyle {
    PENCIL = "pencil",
    WATERCOLOR = "watercolor",
    OIL = "oil",
    ACRYLIC = "acrylic",
    PASTEL = "pastel",
    CHARCOAL = "charcoal",
    INK = "ink",
    OTHER = "other",
}

export interface Sketch {
    id: number;
    original_image_url: string;
    sketch_image_url: string;
    status: SketchStatus;
    type: SketchType;
    style: SketchStyle;
    created_at: Date;
    updated_at: Date;
}



export interface SketchListResponse {
    sketches: Sketch[];
    total: number;
    page: number;
    limit: number;
}