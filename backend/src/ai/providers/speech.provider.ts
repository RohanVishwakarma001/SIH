export interface SpeechProvider {
  transcribeAudio(audioBuffer: Buffer, language: string): Promise<{ transcript: string; confidence: number }>;
}

export class MockSpeechProvider implements SpeechProvider {
  async transcribeAudio(audioBuffer: Buffer, language: string): Promise<{ transcript: string; confidence: number }> {
    const transcripts: Record<string, string> = {
      hi: 'मेरे सीने में पिछले दो घंटे से बहुत तेज दर्द और भारीपन हो रहा है।',
      en: 'I have severe crushing pain in the middle of my chest for the last 2 hours.',
      mr: 'माझ्या छातीत मागच्या दोन तासांपासून खूप दुखत आहे.',
      ta: 'கடந்த இரண்டு மணி நேரமாக என் நெஞ்சில் கடுமையான வலி உள்ளது.',
      te: 'గత రెండు గంటలుగా నా ఛాతీలో తీవ్రమైన నొప్పి ఉంది.',
      bn: 'আমার বুকে বিগত দুই ঘণ্টা ধরে তীব্র ব্যথা হচ্ছে।',
    };

    return {
      transcript: transcripts[language] || transcripts.en,
      confidence: 0.96,
    };
  }
}
