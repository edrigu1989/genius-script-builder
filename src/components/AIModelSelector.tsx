import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface AIModel {
  id: string;
  name: string;
  description: string;
  icon: string;
  badge?: string;
  stats: string;
  features: string[];
  provider: string; // Hidden from user
  model: string; // Hidden from user
}

const AIModelSelector: React.FC<{ onSelect: (model: string) => void; selected?: string }> = ({ onSelect, selected }) => {
  const { t } = useTranslation();

  const aiModels: AIModel[] = [
    {
      id: 'scriptmaster',
      name: t('ai.scriptmaster.name'),
      description: t('ai.scriptmaster.description'),
      icon: '🎯',
      badge: 'Most Popular',
      stats: t('ai.scriptmaster.stats'),
      features: [
        t('ai.scriptmaster.feature1'),
        t('ai.scriptmaster.feature2'),
        t('ai.scriptmaster.feature3'),
        t('ai.scriptmaster.feature4')
      ],
      provider: 'openai',
      model: 'gpt-4'
    },
    {
      id: 'analyticsbrain',
      name: t('ai.analyticsbrain.name'),
      description: t('ai.analyticsbrain.description'),
      icon: '🧠',
      badge: 'Pro',
      stats: t('ai.analyticsbrain.stats'),
      features: [
        t('ai.analyticsbrain.feature1'),
        t('ai.analyticsbrain.feature2'),
        t('ai.analyticsbrain.feature3'),
        t('ai.analyticsbrain.feature4')
      ],
      provider: 'anthropic',
      model: 'claude-3-sonnet'
    },
    {
      id: 'trendhunter',
      name: t('ai.trendhunter.name'),
      description: t('ai.trendhunter.description'),
      icon: '🔥',
      badge: 'Trending',
      stats: t('ai.trendhunter.stats'),
      features: [
        t('ai.trendhunter.feature1'),
        t('ai.trendhunter.feature2'),
        t('ai.trendhunter.feature3'),
        t('ai.trendhunter.feature4')
      ],
      provider: 'google',
      model: 'gemini-pro'
    }
  ];

  return (
    <div className="ai-model-selector">
      <h3 className="text-xl font-semibold mb-4">
        🤖 {t('Choose your content specialist')}:
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {aiModels.map((model) => (
          <Card 
            key={model.id}
            className={`cursor-pointer transition-all hover:shadow-lg ${
              selected === model.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''
            }`}
            onClick={() => onSelect(model.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{model.icon}</span>
                  <CardTitle className="text-lg">{model.name}</CardTitle>
                </div>
                {model.badge && (
                  <Badge variant={model.badge === 'Most Popular' ? 'default' : 'secondary'}>
                    {model.badge}
                  </Badge>
                )}
              </div>
              <CardDescription className="text-sm">
                {model.description}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="space-y-3">
                <div>
                  <p className="font-medium text-sm mb-2">{t('ai.scriptmaster.perfect')}</p>
                  <ul className="text-xs space-y-1">
                    {model.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-1">
                        <span className="text-green-500 mt-0.5">✅</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="bg-gray-50 p-2 rounded text-xs">
                  <div className="font-medium text-blue-600">{model.stats}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {selected && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2">
            <span className="text-green-500">✅</span>
            <span className="font-medium">
              {aiModels.find(m => m.id === selected)?.name} selected
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIModelSelector;

