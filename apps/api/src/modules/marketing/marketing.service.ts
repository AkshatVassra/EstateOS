import { MarketingRepository } from "./marketing.repository";
import { AiRepository } from "../ai/ai.repository";

export class MarketingService {
  static async createCampaign(agencyId: string, name: string) {
    return MarketingRepository.createCampaign(agencyId, name);
  }

  static async getCampaigns(agencyId: string) {
    const [campaigns, generatedPosts] = await Promise.all([
      MarketingRepository.getCampaigns(agencyId),
      MarketingRepository.getGeneratedPosts(agencyId)
    ]);

    return {
      campaigns,
      generatedPosts,
      stats: {
        totalCampaigns: campaigns.length,
        activeCampaigns: campaigns.length,
        totalGeneratedPosts: generatedPosts.length
      }
    };
  }

  static async generateAdCopy(agencyId: string, params: { platform: string; tone?: string; topic: string; propertyDetails?: string }) {
    const { platform = "Instagram", tone = "Luxury & Exclusive", topic, propertyDetails = "" } = params;
    
    // Simulate high-quality real estate AI copywriting engine
    const headlineMap: Record<string, string> = {
      Instagram: `✨ EXCLUSIVE RESIDENCE ALERT | ${topic.toUpperCase()} ✨`,
      Facebook: `🏡 Discover Unrivaled Luxury in ${topic} – Private Viewing Available Now!`,
      LinkedIn: `📈 Prime Investment Opportunity: High-Yield Asset in ${topic}`,
      WhatsApp: `🚨 VIP Early Access: New Release in ${topic} 🏢✨`,
      Email: `[Private Invitation] Experience Prime Living in ${topic}`,
      Brochure: `THE PINNACLE OF MODERN REAL ESTATE: ${topic.toUpperCase()}`,
      Flyer: `OPEN HOUSE & VIP PREVIEW – ${topic.toUpperCase()}`,
      LandingPage: `Invest in ${topic} – Dubai's Most Coveted Waterfront Community`
    };

    const headline = headlineMap[platform] || `✨ EXCLUSIVE PROPERTY ALERT: ${topic.toUpperCase()} ✨`;
    
    const body = `Designed for those who demand excellence, this premier property in ${topic} offers unmatched architectural sophistication, bespoke interiors, and panoramic vistas. ${propertyDetails}\n\nKey Highlights:\n🔹 Prime location with seamless accessibility\n🔹 Ultra-luxury finishes & state-of-the-art amenities\n🔹 Attractive investor payment plan available\n\n💬 Reply 'INFO' or contact our private client advisory team to schedule your discreet consultation today.`;

    const hashtags = `#RealEstate #${topic.replace(/\s+/g, '')} #LuxuryLiving #PrimeProperty #DubaiRealEstate #InvestInLuxury`;
    
    const fullContent = `${headline}\n\n${body}\n\n${hashtags}`;

    // Save generated post & log token usage
    const savedPost = await MarketingRepository.saveGeneratedPost(agencyId, fullContent);
    await AiRepository.logUsage(agencyId, 150);

    return {
      id: savedPost.id,
      platform,
      tone,
      content: fullContent,
      tokensUsed: 150
    };
  }
}
