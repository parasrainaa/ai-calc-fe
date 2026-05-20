/**
 * Shared types for MathDraw application
 */

export interface MathResult {
    expr: string;
    result: string;
    assign?: boolean;
    steps?: string[];
    // Graph plotting fields
    graphable?: boolean;
    plotFunction?: string;
    plotDomain?: [number, number];
}

export interface CalculateRequest {
    image: string;
    dict_of_vars: Record<string, number>;
}

export interface CalculateResponse {
    message: string;
    data?: MathResult[];
    status: "success" | "warning" | "error";
    error?: string;
}

export type DictOfVars = Record<string, number>;
