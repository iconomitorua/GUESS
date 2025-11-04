declare namespace Uni {
    interface $u {
        [key: string]: any;
    }
}

declare module '@/utils' {
    export const $u: Uni.$u;
}