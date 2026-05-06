import fs from 'fs';
import path from 'path';

const file = 'src/components/ClinicalSupport.tsx';
const fullPath = path.resolve(file);
let content = fs.readFileSync(fullPath, 'utf8');

// Replace static strings with translation keys
content = content.replace(/'Differential Assessment'/g, "t[lang].differentialAssessment");
content = content.replace(/'Alternative Protocol'/g, "t[lang].alternativeProtocol");
content = content.replace(/>ZOONOTIC THREAT</g, `>{t[lang].zoonotic}<`);
content = content.replace(/Clinical Rationale & Details/g, "{t[lang].rationaleHeading}");
content = content.replace(/Contextual Relationship/g, "{t[lang].relationshipHeading}");
content = content.replace(/RE-CALCULATE FOR THIS ENTITY/g, "{t[lang].recalculate}");

// Expandable Headers
content = content.replace(/'Expand Details'/g, "t[lang].expandInsights");
content = content.replace(/'Collapse Insights'/g, "t[lang].collapseInsights");

fs.writeFileSync(fullPath, content);
