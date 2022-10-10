declare global {
    interface Window {
        closePayFrame: any;
        Pay: any
    }

    const process: {
        env: {
            ENV: string
        }
    }
}
export { };
