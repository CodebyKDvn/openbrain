import { nanoid } from 'nanoid';
export function createReflection(content, metadata = {}, mistakes = [], lessons = [], patterns = [], antiPatterns = [], decisions = [], userPreferences = [], reusableWorkflows = [], sessionId) {
    return {
        id: nanoid(),
        sessionId,
        createdAt: new Date(),
        content,
        mistakes,
        lessons,
        patterns,
        antiPatterns,
        decisions,
        userPreferences,
        reusableWorkflows,
        metadata
    };
}
