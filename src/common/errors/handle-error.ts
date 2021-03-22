import { app } from "photoshop";

export async function handleException(err: Error) {
    await app.showAlert(err.message);
}