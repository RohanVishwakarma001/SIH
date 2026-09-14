export interface DrugInteractionResult {
  drug1: string;
  drug2: string;
  severity: 'CRITICAL' | 'MAJOR' | 'MODERATE';
  mechanism: string;
  clinicalEffect: string;
  recommendation: string;
  interactionType?: 'drug-drug' | 'herb-drug';
}

interface KnownInteractionRule {
  class1: string[];
  class2: string[];
  severity: 'CRITICAL' | 'MAJOR' | 'MODERATE';
  mechanism: string;
  clinicalEffect: string;
  recommendation: string;
  interactionType?: 'drug-drug' | 'herb-drug';
}

const INTERACTION_RULES: KnownInteractionRule[] = [
  {
    class1: ['telmisartan', 'losartan', 'valsartan', 'olmesartan', 'ramipril', 'enalapril', 'lisinopril'],
    class2: ['spironolactone', 'eplerenone', 'amiloride', 'potassium chloride', 'potassium'],
    severity: 'CRITICAL',
    mechanism: 'Dual blockade of aldosterone release reduces renal potassium excretion synergistically.',
    clinicalEffect: 'Severe Hyperkalemia (Serum K+ > 5.5 mEq/L) leading to fatal cardiac arrhythmias and conduction blocks.',
    recommendation: 'Monitor serum potassium and renal function closely within 3-5 days; consider dose reduction or alternative diuretic.',
    interactionType: 'drug-drug',
  },
  {
    class1: ['atorvastatin', 'simvastatin', 'lovastatin'],
    class2: ['clarithromycin', 'erythromycin', 'itraconazole', 'ketoconazole', 'fluconazole'],
    severity: 'CRITICAL',
    mechanism: 'Potent CYP3A4 inhibition elevates statin plasma concentrations by up to 5-fold.',
    clinicalEffect: 'Marked myotoxicity, elevated CPK, risk of Rhabdomyolysis and myoglobinuric acute renal failure.',
    recommendation: 'Temporarily withhold statin during macrolide/azole course, or switch to rosuvastatin/pravastatin.',
    interactionType: 'drug-drug',
  },
  {
    class1: ['aspirin', 'clopidogrel', 'warfarin', 'rivaroxaban', 'apixaban', 'heparin'],
    class2: ['diclofenac', 'ibuprofen', 'naproxen', 'aceclofenac', 'indomethacin', 'piroxicam'],
    severity: 'MAJOR',
    mechanism: 'NSAID-induced gastrointestinal mucosal erosion and platelet COX-1 inhibition compound anticoagulant/antiplatelet effect.',
    clinicalEffect: 'Severe upper gastrointestinal bleeding, ulcer perforation, and hematoma risk.',
    recommendation: 'Avoid systemic NSAIDs; co-prescribe PPI (Pantoprazole/Omeprazole) if co-administration is unavoidable, or use Paracetamol for analgesia.',
    interactionType: 'drug-drug',
  },
  {
    class1: ['metformin'],
    class2: ['contrast', 'iodinated contrast', 'iohexol', 'iopamidol', 'furosemide'],
    severity: 'MAJOR',
    mechanism: 'Contrast-induced acute nephropathy leads to intracellular metformin accumulation.',
    clinicalEffect: 'Severe Lactic Acidosis with metabolic acidosis and high mortality risk.',
    recommendation: 'Withhold metformin 48 hours before and after contrast procedures; confirm normal eGFR before resuming.',
    interactionType: 'drug-drug',
  },
  {
    class1: ['metoprolol', 'atenolol', 'bisoprolol', 'carvedilol', 'propranolol'],
    class2: ['verapamil', 'diltiazem'],
    severity: 'CRITICAL',
    mechanism: 'Additive negative inotropic and chronotropic effects on the SA and AV nodes.',
    clinicalEffect: 'Profound bradycardia, complete heart block, and precipitous drop in cardiac output.',
    recommendation: 'Contraindicated in outpatient care; switch to dihydropyridine CCB (Amlodipine) if dual therapy is required.',
    interactionType: 'drug-drug',
  },
  {
    class1: ['ciprofloxacin', 'levofloxacin', 'ofloxacin', 'norfloxacin'],
    class2: ['antacid', 'aluminum hydroxide', 'magnesium hydroxide', 'sucralfate', 'iron', 'ferrous ascorbate', 'calcium carbonate'],
    severity: 'MODERATE',
    mechanism: 'Polyvalent metallic cations chelate fluoroquinolones, preventing enteral absorption.',
    clinicalEffect: 'Subtherapeutic antimicrobial concentrations leading to antibiotic failure and drug resistance.',
    recommendation: 'Separate administration by at least 2 hours before or 4 hours after cation-containing supplements.',
    interactionType: 'drug-drug',
  },
  {
    class1: ['tramadol'],
    class2: ['fluoxetine', 'sertraline', 'escitalopram', 'paroxetine', 'duloxetine', 'venlafaxine'],
    severity: 'MAJOR',
    mechanism: 'Additive serotonergic neurotransmission and CYP2D6 competition.',
    clinicalEffect: 'Risk of Serotonin Syndrome (hyperreflexia, clonus, fever, agitation, autonomic instability).',
    recommendation: 'Monitor closely for serotonergic toxicity; consider non-serotonergic analgesia.',
    interactionType: 'drug-drug',
  },
  // Ayurvedic Herb - Modern Drug Interactions (Ministry of Ayush / AIIA Clinical Protocol)
  {
    class1: ['aspirin', 'clopidogrel', 'warfarin', 'rivaroxaban', 'apixaban', 'heparin'],
    class2: ['guggulu', 'guggul', 'garlic', 'lasuna', 'ginger', 'adrak', 'ginkgo'],
    severity: 'MAJOR',
    mechanism: 'Synergistic antiplatelet and fibrinolytic properties of guggulsterones/allicin compound modern antithrombotic therapy.',
    clinicalEffect: 'Elevated risk of major bleeding, spontaneous hematomas, and prolonged coagulation times.',
    recommendation: 'Discontinue high-dose guggulu/garlic supplements prior to invasive procedures; monitor INR/coagulation profile closely.',
    interactionType: 'herb-drug',
  },
  {
    class1: ['telmisartan', 'losartan', 'amlodipine', 'metoprolol', 'atenolol', 'clonazepam', 'alprazolam'],
    class2: ['ashwagandha', 'withania', 'sarpagandha', 'brahmi', 'shankhpushpi'],
    severity: 'MAJOR',
    mechanism: 'GABAergic and sympatholytic actions of withanolides/reserpine synergize with modern antihypertensives and sedatives.',
    clinicalEffect: 'Additive hypotension, sudden postural drop in blood pressure, excessive daytime sedation, and syncope.',
    recommendation: 'Titrate allopathic antihypertensive cautiously; instruct patient to report dizziness or orthostatic lightheadedness.',
    interactionType: 'herb-drug',
  },
  {
    class1: ['digoxin', 'furosemide', 'torsemide', 'hydrochlorothiazide'],
    class2: ['yashtimadhu', 'mulethi', 'glycyrrhiza', 'licorice'],
    severity: 'CRITICAL',
    mechanism: 'Glycyrrhizic acid inhibits renal 11β-hydroxysteroid dehydrogenase type 2 (11β-HSD2), leading to apparent mineralocorticoid excess and potassium wasting.',
    clinicalEffect: 'Severe Hypokalemia triggering fatal digoxin-induced arrhythmias, ventricular tachycardia, and pseudoaldosteronism.',
    recommendation: 'Strictly avoid concomitant use of Yashtimadhu with digoxin and loop diuretics; check serum potassium immediately.',
    interactionType: 'herb-drug',
  },
  {
    class1: ['metformin', 'glimepiride', 'glipizide', 'gliclazide', 'insulin'],
    class2: ['karela', 'bitter gourd', 'jamun', 'fenugreek', 'methi', 'gurmar', 'gymnema'],
    severity: 'MAJOR',
    mechanism: 'Charantin and polypeptide-p possess potent insulin-mimetic activity that potentiates pharmaceutical oral hypoglycemics.',
    clinicalEffect: 'Unperceived severe hypoglycemia (Blood glucose < 54 mg/dL), neuroglycopenia, and tremors.',
    recommendation: 'Advise patient to self-monitor blood sugar frequently; adjust oral antidiabetic dosages when starting Ayurvedic metabolic formulations.',
    interactionType: 'herb-drug',
  },
  {
    class1: ['digoxin', 'warfarin', 'levothyroxine'],
    class2: ['triphala', 'senna', 'haritaki', 'isabgol', 'psyllium'],
    severity: 'MODERATE',
    mechanism: 'Bulk anthraquinone laxatives accelerate gastrointestinal motility and adsorb active pharmaceutical compounds.',
    clinicalEffect: 'Subtherapeutic plasma levels of narrow-therapeutic-index medications resulting in treatment failure.',
    recommendation: 'Administer Ayurvedic formulations at least 2 to 3 hours apart from critical oral allopathic medications.',
    interactionType: 'herb-drug',
  }
];

export class DrugInteractionEngine {
  /**
   * Scans a list of medication names/entities and identifies potential drug-drug & herb-drug interactions.
   */
  public static checkInteractions(medicationStrings: string[]): DrugInteractionResult[] {
    const results: DrugInteractionResult[] = [];
    const normalizedList = medicationStrings.map(m => m.toLowerCase().trim()).filter(Boolean);

    for (let i = 0; i < normalizedList.length; i++) {
      for (let j = i + 1; j < normalizedList.length; j++) {
        const medA = normalizedList[i];
        const medB = normalizedList[j];

        for (const rule of INTERACTION_RULES) {
          const matchAtoClass1 = rule.class1.some(c => medA.includes(c));
          const matchBtoClass2 = rule.class2.some(c => medB.includes(c));

          const matchBtoClass1 = rule.class1.some(c => medB.includes(c));
          const matchAtoClass2 = rule.class2.some(c => medA.includes(c));

          if ((matchAtoClass1 && matchBtoClass2) || (matchBtoClass1 && matchAtoClass2)) {
            // Found a match
            results.push({
              drug1: medicationStrings[i],
              drug2: medicationStrings[j],
              severity: rule.severity,
              mechanism: rule.mechanism,
              clinicalEffect: rule.clinicalEffect,
              recommendation: rule.recommendation,
              interactionType: rule.interactionType || 'drug-drug',
            });
          }
        }
      }
    }

    return results;
  }
}
