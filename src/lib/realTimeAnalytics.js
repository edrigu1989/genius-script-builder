// Real-time Analytics Service - Live data tracking and ROI calculation
import { api } from './supabase';
import { SocialMediaAnalytics } from './socialMediaService';

// Analytics Configuration
export const ANALYTICS_CONFIG = {
  REFRESH_INTERVAL: 300000, // 5 minutes
  BATCH_SIZE: 100,
  RETENTION_DAYS: 365,
  REAL_TIME_EVENTS: [
    'script_generated',
    'content_published',
    'engagement_received',
    'conversion_tracked'
  ]
};

// Real-time Analytics Manager
export class RealTimeAnalytics {
  constructor(userId) {
    this.userId = userId;
    this.eventQueue = [];
    this.isProcessing = false;
    this.subscribers = new Map();
    this.metrics = new Map();
  }

  // Initialize analytics tracking
  async initialize() {
    try {
      // Load historical data
      await this.loadHistoricalData();
      
      // Start real-time tracking
      this.startRealTimeTracking();
      
      // Setup periodic data sync
      this.setupPeriodicSync();
      
      return true;
    } catch (error) {
      console.error('Error initializing analytics:', error);
      return false;
    }
  }

  // Load historical analytics data
  async loadHistoricalData() {
    try {
      const [scripts, published, analytics] = await Promise.all([
        api.getClientScripts(this.userId),
        api.getPublishedContent(this.userId),
        api.getClientAnalytics(this.userId)
      ]);

      // Process and store metrics
      this.processHistoricalData(scripts, published, analytics);
      
    } catch (error) {
      console.error('Error loading historical data:', error);
    }
  }

  // Process historical data into metrics
  processHistoricalData(scripts, published, analytics) {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));

    // Scripts metrics
    const recentScripts = scripts.filter(s => new Date(s.created_at) >= thirtyDaysAgo);
    this.metrics.set('scripts_generated', {
      total: scripts.length,
      last_30_days: recentScripts.length,
      avg_per_day: recentScripts.length / 30
    });

    // Published content metrics
    const recentPublished = published.filter(p => new Date(p.published_at) >= thirtyDaysAgo);
    this.metrics.set('content_published', {
      total: published.length,
      last_30_days: recentPublished.length,
      by_platform: this.groupByPlatform(recentPublished)
    });

    // Engagement metrics
    const totalEngagement = analytics.reduce((sum, a) => sum + (a.total_engagement || 0), 0);
    this.metrics.set('engagement', {
      total: totalEngagement,
      avg_per_content: published.length > 0 ? totalEngagement / published.length : 0,
      by_platform: this.calculateEngagementByPlatform(analytics)
    });

    // ROI metrics
    this.calculateROI(scripts, published, analytics);
  }

  // Group data by platform
  groupByPlatform(data) {
    return data.reduce((acc, item) => {
      const platform = item.platform || 'unknown';
      acc[platform] = (acc[platform] || 0) + 1;
      return acc;
    }, {});
  }

  // Calculate engagement by platform
  calculateEngagementByPlatform(analytics) {
    return analytics.reduce((acc, item) => {
      const platform = item.platform || 'unknown';
      if (!acc[platform]) {
        acc[platform] = { total: 0, count: 0 };
      }
      acc[platform].total += item.total_engagement || 0;
      acc[platform].count += 1;
      return acc;
    }, {});
  }

  // Calculate ROI metrics
  calculateROI(scripts, published, analytics) {
    // Simulate ROI calculation based on engagement and conversions
    const totalInvestment = scripts.length * 0.5; // $0.50 per script generated
    const totalRevenue = analytics.reduce((sum, a) => {
      // Simulate revenue based on engagement (conversion rate * avg order value)
      const conversions = (a.total_engagement || 0) * 0.02; // 2% conversion rate
      const avgOrderValue = 50; // $50 average order value
      return sum + (conversions * avgOrderValue);
    }, 0);

    const roi = totalInvestment > 0 ? ((totalRevenue - totalInvestment) / totalInvestment) * 100 : 0;

    this.metrics.set('roi', {
      total_investment: totalInvestment,
      total_revenue: totalRevenue,
      roi_percentage: roi,
      break_even_point: totalInvestment / (totalRevenue / published.length || 1)
    });
  }

  // Track real-time event
  async trackEvent(eventType, eventData) {
    try {
      const event = {
        user_id: this.userId,
        event_type: eventType,
        event_data: eventData,
        timestamp: new Date().toISOString(),
        session_id: this.getSessionId()
      };

      // Add to queue for batch processing
      this.eventQueue.push(event);

      // Process immediately for real-time events
      if (ANALYTICS_CONFIG.REAL_TIME_EVENTS.includes(eventType)) {
        await this.processEvent(event);
      }

      // Notify subscribers
      this.notifySubscribers(eventType, event);

    } catch (error) {
      console.error('Error tracking event:', error);
    }
  }

  // Process individual event
  async processEvent(event) {
    try {
      switch (event.event_type) {
        case 'script_generated':
          await this.handleScriptGenerated(event);
          break;
        case 'content_published':
          await this.handleContentPublished(event);
          break;
        case 'engagement_received':
          await this.handleEngagementReceived(event);
          break;
        case 'conversion_tracked':
          await this.handleConversionTracked(event);
          break;
        default:
          console.log('Unknown event type:', event.event_type);
      }

      // Save event to database
      await api.saveAnalyticsEvent(event);

    } catch (error) {
      console.error('Error processing event:', error);
    }
  }

  // Handle script generation event
  async handleScriptGenerated(event) {
    const current = this.metrics.get('scripts_generated') || { total: 0, last_30_days: 0 };
    current.total += 1;
    current.last_30_days += 1;
    this.metrics.set('scripts_generated', current);

    // Update costs
    const roi = this.metrics.get('roi') || { total_investment: 0 };
    roi.total_investment += 0.5; // $0.50 per script
    this.metrics.set('roi', roi);
  }

  // Handle content publishing event
  async handleContentPublished(event) {
    const current = this.metrics.get('content_published') || { total: 0, last_30_days: 0, by_platform: {} };
    current.total += 1;
    current.last_30_days += 1;
    
    const platform = event.event_data.platform || 'unknown';
    current.by_platform[platform] = (current.by_platform[platform] || 0) + 1;
    
    this.metrics.set('content_published', current);
  }

  // Handle engagement event
  async handleEngagementReceived(event) {
    const current = this.metrics.get('engagement') || { total: 0, by_platform: {} };
    const engagementValue = event.event_data.value || 1;
    
    current.total += engagementValue;
    
    const platform = event.event_data.platform || 'unknown';
    if (!current.by_platform[platform]) {
      current.by_platform[platform] = { total: 0, count: 0 };
    }
    current.by_platform[platform].total += engagementValue;
    current.by_platform[platform].count += 1;
    
    this.metrics.set('engagement', current);

    // Update ROI with potential revenue
    this.updateROIFromEngagement(engagementValue);
  }

  // Handle conversion tracking event
  async handleConversionTracked(event) {
    const roi = this.metrics.get('roi') || { total_revenue: 0 };
    const conversionValue = event.event_data.value || 50; // Default $50
    
    roi.total_revenue += conversionValue;
    roi.roi_percentage = roi.total_investment > 0 ? 
      ((roi.total_revenue - roi.total_investment) / roi.total_investment) * 100 : 0;
    
    this.metrics.set('roi', roi);
  }

  // Update ROI from engagement
  updateROIFromEngagement(engagementValue) {
    const roi = this.metrics.get('roi') || { total_revenue: 0, total_investment: 0 };
    
    // Simulate revenue from engagement (2% conversion rate, $50 AOV)
    const potentialRevenue = engagementValue * 0.02 * 50;
    roi.total_revenue += potentialRevenue;
    
    if (roi.total_investment > 0) {
      roi.roi_percentage = ((roi.total_revenue - roi.total_investment) / roi.total_investment) * 100;
    }
    
    this.metrics.set('roi', roi);
  }

  // Get current metrics
  getCurrentMetrics() {
    const metrics = {};
    for (const [key, value] of this.metrics.entries()) {
      metrics[key] = { ...value };
    }
    return metrics;
  }

  // Get performance dashboard data
  async getPerformanceDashboard(dateRange = '30d') {
    try {
      const metrics = this.getCurrentMetrics();
      
      // Get social media analytics
      const socialAnalytics = new SocialMediaAnalytics({ userId: this.userId });
      const unifiedAnalytics = await socialAnalytics.getUnifiedAnalytics(dateRange);

      // Combine all metrics
      const dashboard = {
        overview: {
          scripts_generated: metrics.scripts_generated?.last_30_days || 0,
          content_published: metrics.content_published?.last_30_days || 0,
          total_engagement: metrics.engagement?.total || 0,
          roi_percentage: metrics.roi?.roi_percentage || 0
        },
        revenue: {
          total_revenue: metrics.roi?.total_revenue || 0,
          total_investment: metrics.roi?.total_investment || 0,
          profit: (metrics.roi?.total_revenue || 0) - (metrics.roi?.total_investment || 0),
          break_even_point: metrics.roi?.break_even_point || 0
        },
        platforms: unifiedAnalytics.platforms || {},
        trends: await this.calculateTrends(dateRange),
        predictions: await this.generatePredictions(),
        recommendations: await this.generateRecommendations()
      };

      return dashboard;
    } catch (error) {
      console.error('Error getting performance dashboard:', error);
      throw error;
    }
  }

  // Calculate trends
  async calculateTrends(dateRange) {
    try {
      // Get historical data for trend calculation
      const historicalData = await api.getAnalyticsTrends(this.userId, dateRange);
      
      // Calculate growth rates
      const trends = {
        scripts_growth: this.calculateGrowthRate(historicalData, 'scripts_generated'),
        engagement_growth: this.calculateGrowthRate(historicalData, 'total_engagement'),
        revenue_growth: this.calculateGrowthRate(historicalData, 'revenue'),
        roi_trend: this.calculateROITrend(historicalData)
      };

      return trends;
    } catch (error) {
      console.error('Error calculating trends:', error);
      return {
        scripts_growth: 0,
        engagement_growth: 0,
        revenue_growth: 0,
        roi_trend: 'stable'
      };
    }
  }

  // Calculate growth rate
  calculateGrowthRate(data, metric) {
    if (!data || data.length < 2) return 0;
    
    const latest = data[data.length - 1][metric] || 0;
    const previous = data[data.length - 2][metric] || 0;
    
    if (previous === 0) return latest > 0 ? 100 : 0;
    
    return ((latest - previous) / previous) * 100;
  }

  // Calculate ROI trend
  calculateROITrend(data) {
    if (!data || data.length < 3) return 'stable';
    
    const recent = data.slice(-3).map(d => d.roi_percentage || 0);
    const isIncreasing = recent[2] > recent[1] && recent[1] > recent[0];
    const isDecreasing = recent[2] < recent[1] && recent[1] < recent[0];
    
    if (isIncreasing) return 'increasing';
    if (isDecreasing) return 'decreasing';
    return 'stable';
  }

  // Generate predictions
  async generatePredictions() {
    try {
      const metrics = this.getCurrentMetrics();
      
      // Simple linear prediction based on current trends
      const predictions = {
        next_month_scripts: Math.round((metrics.scripts_generated?.avg_per_day || 0) * 30),
        next_month_revenue: (metrics.roi?.total_revenue || 0) * 1.1, // 10% growth assumption
        projected_roi: (metrics.roi?.roi_percentage || 0) * 1.05, // 5% improvement assumption
        break_even_date: this.calculateBreakEvenDate(metrics.roi)
      };

      return predictions;
    } catch (error) {
      console.error('Error generating predictions:', error);
      return {};
    }
  }

  // Calculate break-even date
  calculateBreakEvenDate(roiData) {
    if (!roiData || roiData.roi_percentage >= 0) return 'Already profitable';
    
    const monthlyRevenue = roiData.total_revenue / 30; // Assume 30 days of data
    const remainingInvestment = Math.abs(roiData.total_revenue - roiData.total_investment);
    const monthsToBreakEven = Math.ceil(remainingInvestment / monthlyRevenue);
    
    const breakEvenDate = new Date();
    breakEvenDate.setMonth(breakEvenDate.getMonth() + monthsToBreakEven);
    
    return breakEvenDate.toLocaleDateString();
  }

  // Generate recommendations
  async generateRecommendations() {
    try {
      const metrics = this.getCurrentMetrics();
      const recommendations = [];

      // Script generation recommendations
      if ((metrics.scripts_generated?.avg_per_day || 0) < 1) {
        recommendations.push({
          type: 'content',
          priority: 'high',
          title: 'Aumentar generación de scripts',
          description: 'Genera al menos 1 script por día para mantener consistencia',
          action: 'Crear más contenido'
        });
      }

      // Engagement recommendations
      const avgEngagement = metrics.engagement?.avg_per_content || 0;
      if (avgEngagement < 50) {
        recommendations.push({
          type: 'engagement',
          priority: 'medium',
          title: 'Mejorar engagement',
          description: 'El engagement promedio está por debajo del objetivo',
          action: 'Optimizar contenido'
        });
      }

      // ROI recommendations
      if ((metrics.roi?.roi_percentage || 0) < 100) {
        recommendations.push({
          type: 'roi',
          priority: 'high',
          title: 'Optimizar ROI',
          description: 'El retorno de inversión puede mejorarse',
          action: 'Revisar estrategia'
        });
      }

      // Platform diversification
      const platforms = Object.keys(metrics.content_published?.by_platform || {});
      if (platforms.length < 3) {
        recommendations.push({
          type: 'platforms',
          priority: 'medium',
          title: 'Diversificar plataformas',
          description: 'Expandir presencia a más redes sociales',
          action: 'Conectar plataformas'
        });
      }

      return recommendations;
    } catch (error) {
      console.error('Error generating recommendations:', error);
      return [];
    }
  }

  // Subscribe to real-time updates
  subscribe(eventType, callback) {
    if (!this.subscribers.has(eventType)) {
      this.subscribers.set(eventType, new Set());
    }
    this.subscribers.get(eventType).add(callback);

    // Return unsubscribe function
    return () => {
      const subscribers = this.subscribers.get(eventType);
      if (subscribers) {
        subscribers.delete(callback);
      }
    };
  }

  // Notify subscribers
  notifySubscribers(eventType, data) {
    const subscribers = this.subscribers.get(eventType);
    if (subscribers) {
      subscribers.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error('Error in subscriber callback:', error);
        }
      });
    }

    // Also notify 'all' subscribers
    const allSubscribers = this.subscribers.get('all');
    if (allSubscribers) {
      allSubscribers.forEach(callback => {
        try {
          callback({ eventType, data });
        } catch (error) {
          console.error('Error in all subscriber callback:', error);
        }
      });
    }
  }

  // Start real-time tracking
  startRealTimeTracking() {
    // Process event queue periodically
    setInterval(() => {
      this.processEventQueue();
    }, 10000); // Every 10 seconds

    // Refresh metrics periodically
    setInterval(() => {
      this.refreshMetrics();
    }, ANALYTICS_CONFIG.REFRESH_INTERVAL);
  }

  // Process event queue
  async processEventQueue() {
    if (this.isProcessing || this.eventQueue.length === 0) return;

    this.isProcessing = true;
    try {
      const batch = this.eventQueue.splice(0, ANALYTICS_CONFIG.BATCH_SIZE);
      
      for (const event of batch) {
        await this.processEvent(event);
      }
    } catch (error) {
      console.error('Error processing event queue:', error);
    } finally {
      this.isProcessing = false;
    }
  }

  // Refresh metrics from database
  async refreshMetrics() {
    try {
      await this.loadHistoricalData();
      this.notifySubscribers('metrics_updated', this.getCurrentMetrics());
    } catch (error) {
      console.error('Error refreshing metrics:', error);
    }
  }

  // Setup periodic data sync
  setupPeriodicSync() {
    // Sync with external APIs every hour
    setInterval(async () => {
      try {
        await this.syncExternalData();
      } catch (error) {
        console.error('Error syncing external data:', error);
      }
    }, 3600000); // Every hour
  }

  // Sync with external APIs
  async syncExternalData() {
    try {
      // Sync social media metrics
      const socialAnalytics = new SocialMediaAnalytics({ userId: this.userId });
      const platforms = ['facebook', 'instagram', 'twitter', 'linkedin'];
      
      for (const platform of platforms) {
        try {
          const metrics = await socialAnalytics.getPlatformMetrics(platform);
          await this.trackEvent('platform_metrics_synced', {
            platform,
            metrics,
            sync_timestamp: new Date().toISOString()
          });
        } catch (error) {
          console.error(`Error syncing ${platform} metrics:`, error);
        }
      }
    } catch (error) {
      console.error('Error in external data sync:', error);
    }
  }

  // Get session ID
  getSessionId() {
    let sessionId = sessionStorage.getItem('analytics_session_id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('analytics_session_id', sessionId);
    }
    return sessionId;
  }

  // Generate analytics report
  async generateReport(dateRange = '30d', format = 'json') {
    try {
      const dashboard = await this.getPerformanceDashboard(dateRange);
      
      const report = {
        generated_at: new Date().toISOString(),
        date_range: dateRange,
        user_id: this.userId,
        summary: {
          total_scripts: dashboard.overview.scripts_generated,
          total_published: dashboard.overview.content_published,
          total_engagement: dashboard.overview.total_engagement,
          roi_percentage: dashboard.overview.roi_percentage,
          profit: dashboard.revenue.profit
        },
        detailed_metrics: dashboard,
        recommendations: dashboard.recommendations,
        next_steps: this.generateNextSteps(dashboard)
      };

      if (format === 'pdf') {
        return await this.generatePDFReport(report);
      }

      return report;
    } catch (error) {
      console.error('Error generating report:', error);
      throw error;
    }
  }

  // Generate next steps
  generateNextSteps(dashboard) {
    const steps = [];
    
    if (dashboard.overview.roi_percentage < 100) {
      steps.push('Optimizar estrategia de contenido para mejorar ROI');
    }
    
    if (dashboard.overview.scripts_generated < 30) {
      steps.push('Aumentar frecuencia de generación de scripts');
    }
    
    if (Object.keys(dashboard.platforms).length < 3) {
      steps.push('Expandir presencia a más plataformas sociales');
    }
    
    return steps;
  }
}

// Email reporting service
export class EmailReportingService {
  constructor(analytics) {
    this.analytics = analytics;
  }

  // Send weekly report
  async sendWeeklyReport(userEmail) {
    try {
      const report = await this.analytics.generateReport('7d');
      
      // In a real implementation, this would send an actual email
      console.log('Sending weekly report to:', userEmail);
      console.log('Report data:', report);
      
      // Simulate email sending
      return {
        success: true,
        message: 'Weekly report sent successfully',
        sent_at: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error sending weekly report:', error);
      throw error;
    }
  }

  // Send monthly report
  async sendMonthlyReport(userEmail) {
    try {
      const report = await this.analytics.generateReport('30d');
      
      console.log('Sending monthly report to:', userEmail);
      console.log('Report data:', report);
      
      return {
        success: true,
        message: 'Monthly report sent successfully',
        sent_at: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error sending monthly report:', error);
      throw error;
    }
  }
}

export default {
  RealTimeAnalytics,
  EmailReportingService,
  ANALYTICS_CONFIG
};

