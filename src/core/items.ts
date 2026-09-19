export interface Item {
    id: string; 
    name: string;
    description: string;
    price: number;
}

export const ITEMS: Item[] = [
   {id:"streak_reviver", name: "Streak Reviver", description: "Restores a broken coding streak.", price: 50 } ,
   {id:"happiness_bottle", name: "Happydust" , description: "boosts your pet's happiness.",price:20 } ,
   {id:"energy_drink", name: "Energy Drink" , description: "Restores your pet's energy." , price: 15 } ,
   {id:"snack_pack", name: "Snack" , description: "A tasty treat for your pet.", price: 15 } ,
   {id:"golden_semicolon", name: "Golden Semiclon", description: "Fully restores all stats", price : 100 },
   {id:"debug_spray", name:"Debug Spray", description: "removes a negetive status effect", price: 30} ,
   {id:"commit_charm", name: "Commit Charm", description:"Slows the stats decay for a day.", price:40 },
   {id: "rubber_duck", name: "Rubber Duck" , description: "A side toy. No effect.", price: 5 },
   {id:"night_owl_potion", name: "Night Owl Potion", description:" Protects your streak overnight.", price: 40 } ,
   {id:"cup_o'_coffee", name: "Cup O'Coffee" , description: "Small boost to all stats.", price: 10 },
]