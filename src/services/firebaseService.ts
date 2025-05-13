import { 
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  getDoc
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Trade } from '../types';

// Firebase document with additional fields
type FirebaseTradeDocument = Trade;

const TRADES_COLLECTION = 'trades';

export const firebaseService = {
  // Get all trades for a user
  async getTrades(userId: string): Promise<Trade[]> {
    const tradesRef = collection(db, TRADES_COLLECTION);
    const q = query(
      tradesRef,
      where('userId', '==', userId),
      orderBy('date', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Trade[];
  },

  // Get a single trade by ID
  async getTrade(tradeId: string): Promise<Trade | null> {
    const tradeRef = doc(db, TRADES_COLLECTION, tradeId);
    const tradeDoc = await getDoc(tradeRef);

    if (!tradeDoc.exists()) return null;

    return {
      id: tradeDoc.id,
      ...tradeDoc.data()
    } as Trade;
  },

  // Add a new trade
  async addTrade(userId: string, trade: Omit<Trade, 'id'>): Promise<string> {
    const tradesRef = collection(db, TRADES_COLLECTION);

    // Clean and validate data
    const cleanedData = {
      date: trade.date,
      symbol: trade.symbol,
      direction: trade.direction,
      entryPrice: trade.entryPrice,
      exitPrice: trade.exitPrice,
      profit: trade.profit,
      profitPercentage: trade.profitPercentage,
      lotSize: trade.lotSize,
      quantity: trade.quantity,
      fees: trade.fees,
      strategy: trade.strategy,
      setup: trade.setup,
      notes: trade.notes,
      tags: trade.tags,
      screenshots: Array.isArray(trade.screenshots)
        ? trade.screenshots
        : [],
      stopLoss: trade.stopLoss,
      takeProfit: trade.takeProfit,
      timeFrame: trade.timeFrame,
      emotions: trade.emotions,
      rating: trade.rating || 0,
      violations: trade.violations || [],
      userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const docRef = await addDoc(tradesRef, cleanedData);
    return docRef.id;
  },

  // Update an existing trade
  async updateTrade(tradeId: string, updatedTrade: Omit<Trade, 'id'>): Promise<void> {
    const tradeRef = doc(db, TRADES_COLLECTION, tradeId);
    await updateDoc(tradeRef, {
      ...updatedTrade,
      updatedAt: new Date().toISOString()
    });
  },

  // Delete a trade
  async deleteTrade(tradeId: string): Promise<void> {
    const tradeRef = doc(db, TRADES_COLLECTION, tradeId);
    await deleteDoc(tradeRef);
  }
};
