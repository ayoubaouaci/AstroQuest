export interface ChartPoint {
    sign: string;
    degree: number;
    house?: number;
    influence?: string;
}

export interface AspectLine {
    from: string;
    to: string;
    type: string;
    color: string;
    active: boolean;
}

export interface AstrologicalEngine {
    chart_points: {
        ascendant: ChartPoint;
        sun: ChartPoint;
        moon: ChartPoint;
        [key: string]: ChartPoint; // Allow other planets
    };
    aspect_lines: AspectLine[];
}

export interface OracleDialogueStream {
    intro: string;
    analysis: string;
    unlock_cost: number;
    wallet_balance: number;
}

export interface OracleModule {
    active_card: string;
    dialogue_stream: OracleDialogueStream;
}

export interface RenderingEngine {
    canvas_id: string;
    dominant_element?: "fire" | "earth" | "air" | "water"; // New Theme Prop
    ascendant_degree?: number; // New Rotation Prop
    draw_sequence: Array<{
        task: string;
        style?: string;
        degree?: number;
        label?: string;
        id?: string;
        sign?: string;
        exact_degree?: number;
        from?: string;
        to?: string;
        type?: string;
        hex?: string;
    }>;
    animation: {
        type: string;
        duration_ms: number;
    }
}

export interface ApplicationState {
    application_state: {
        user_profile: {
            name: string;
            birth_data: { date: string; time: string; city: string; };
        };
        astrological_engine: AstrologicalEngine;
        oracle_module: OracleModule;
        rendering_engine?: RenderingEngine; // New Module
    }
}
