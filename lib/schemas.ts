/**
 * JSON response schemas for structured agent outputs
 * Used with Venice API's response_format parameter
 */

export const DEBATE_ROUND_SCHEMA = {
  type: 'json_schema' as const,
  json_schema: {
    name: 'debate_round',
    strict: true,
    schema: {
      type: 'object',
      properties: {
        claim: {
          type: 'string',
          description: 'The agent\'s main claim for this round',
        },
        evidence: {
          type: 'array',
          description: 'Supporting evidence points',
          items: {
            type: 'object',
            properties: {
              point: { type: 'string' },
              source: { type: ['string', 'null'] },
            },
            required: ['point'],
            additionalProperties: false,
          },
        },
        counter_to_opponent: {
          type: ['string', 'null'],
          description: 'Direct counter to the opponent\'s previous argument',
        },
      },
      required: ['claim', 'evidence'],
      additionalProperties: false,
    },
  },
};

export const JUDGE_VERDICT_SCHEMA = {
  type: 'json_schema' as const,
  json_schema: {
    name: 'debate_verdict',
    strict: true,
    schema: {
      type: 'object',
      properties: {
        prediction: {
          type: 'string',
          enum: ['YES', 'NO'],
          description: 'Final prediction: YES (will happen) or NO (will not happen)',
        },
        confidence: {
          type: 'number',
          minimum: 0,
          maximum: 1,
          description: 'Confidence level 0-1',
        },
        scores: {
          type: 'object',
          properties: {
            proponent: {
              type: 'object',
              properties: {
                logic: {
                  type: 'integer',
                  minimum: 1,
                  maximum: 10,
                },
                evidence: {
                  type: 'integer',
                  minimum: 1,
                  maximum: 10,
                },
                persuasion: {
                  type: 'integer',
                  minimum: 1,
                  maximum: 10,
                },
              },
              required: ['logic', 'evidence', 'persuasion'],
              additionalProperties: false,
            },
            opponent: {
              type: 'object',
              properties: {
                logic: {
                  type: 'integer',
                  minimum: 1,
                  maximum: 10,
                },
                evidence: {
                  type: 'integer',
                  minimum: 1,
                  maximum: 10,
                },
                persuasion: {
                  type: 'integer',
                  minimum: 1,
                  maximum: 10,
                },
              },
              required: ['logic', 'evidence', 'persuasion'],
              additionalProperties: false,
            },
          },
          required: ['proponent', 'opponent'],
          additionalProperties: false,
        },
        reasoning: {
          type: 'string',
          description: 'Explanation of the verdict',
        },
      },
      required: ['prediction', 'confidence', 'scores', 'reasoning'],
      additionalProperties: false,
    },
  },
};

export const RESEARCH_SUMMARY_SCHEMA = {
  type: 'json_schema' as const,
  json_schema: {
    name: 'research_summary',
    strict: true,
    schema: {
      type: 'object',
      properties: {
        current_state: {
          type: 'string',
          description: 'Current state of the topic',
        },
        key_data_points: {
          type: 'array',
          items: { type: 'string' },
          description: 'Key data points and facts',
        },
        expert_opinions: {
          type: 'array',
          items: { type: 'string' },
          description: 'Expert predictions and opinions',
        },
        recent_trends: {
          type: 'string',
          description: 'Recent relevant trends',
        },
      },
      required: ['current_state', 'key_data_points'],
      additionalProperties: false,
    },
  },
};
