import { eq } from "drizzle-orm";
import inventoryModule from "@/core/inventory";
import { db } from"@/db";
import { pet } from "@/db/schema";

const MAX_STAT = 100;

type PetRow = typeof pet.$inferSelect;

function clamp(n: number): number {
    return Math.max(0, Math.min(MAX_STAT, n));
}

//each item id maps to a function tht retuens the pet columns to chnge
const EFFECTS: Record<string, (p: PetRow) => Partial<PetRow>> = {
    snack_pack:(p) => ({ hunger: clamp(p.hunger + 20) }),
    happiness_bottle: (p) =>({ happiness: clamp(p.happiness + 20) }),
    energy_drink: (p) => ({ energy: clamp(p.energy + 25) }),
    "cup_o'_coffee": (p) => ({
        hunger: clamp(p.hunger +5),
        happiness: clamp(p.happiness +5),
        energy: clamp(p.energy + 5),
    }),
    golden_semicolon: () => ({
        hunger: MAX_STAT,
        happiness: MAX_STAT,
        energy: MAX_STAT,
    }),
};

//RETURNS TRUE IF EFFECT WS APPLIED
export async function applyItemEffect(
    itemId: string,
    userId: number = 1,
): Promise<boolean> {
    const effect = EFFECTS[itemId];
    if (!effect) return false;

    const [current] = await db.select().from(pet).where(eq(pet.userId, userId));
    if (!current || !current.isAlive) return false;

    await db.update(pet).set(effect(current)).where(eq(pet.id, current.id));
    return true;
}

//uses one item:checksif u own it, applies it, then removes it
export async function useItem(
    itemId: string,
    userId: number = 1,
): Promise<boolean> {
    const owned =  await inventoryModule.getInventoryItem(itemId, userId);
    if (!owned || owned.quantity < 1 ) return false;

    const used = await applyItemEffect(itemId, userId);
    if (!used) return false;

    await inventoryModule.removeItemFromInventory(itemId,userId);
    return true;
}

export default { applyItemEffect, useItem };