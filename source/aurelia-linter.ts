import {Linter, Rule, Issue, IssueSeverity} from 'template-lint';

import {SelfCloseRule} from 'template-lint';
import {StructureRule} from 'template-lint';
import {ObsoleteTagRule} from 'template-lint';
import {ObsoleteAttributeRule} from 'template-lint';
import {UniqueIdRule} from 'template-lint';
import {AttributeValueRule} from 'template-lint';

import {RequireRule} from './rules/require';
import {SlotRule} from './rules/slot';
import {TemplateRule} from './rules/template';
import {RepeatForRule} from './rules/repeatfor';
import {StaticTypeRule} from './rules/static-type';
import {ConflictingAttributesRule, ConflictingAttributes} from './rules/conflictingattributes';

import {Reflection} from './reflection';
import {Config} from './config';

import {initialize} from 'aurelia-pal-nodejs';

initialize();

export class AureliaLinter {
    linter: Linter;
    reflection: Reflection;
    config: Config;

    constructor(config?: Config) {

        if (config == undefined)
            config = new Config();

        this.config = config;
        this.reflection = new Reflection();   

        let rules = [
            new SelfCloseRule(),
            new StructureRule(),
            new ObsoleteAttributeRule(config.obsoleteAttributes),
            new ObsoleteTagRule(config.obsoleteTags),
            new UniqueIdRule(),
            new AttributeValueRule(config.attributeValueRules),

            new RequireRule(),
            new SlotRule(config.templateControllers),
            new TemplateRule(config.containers),
            new ConflictingAttributesRule(<ConflictingAttributes[]> config.conflictingAttributes),
            new RepeatForRule(),
            new StaticTypeRule(this.reflection)

        ].concat(config.customRules);
       
        this.linter = new Linter(
            rules,
            config.scopes,
            config.voids);
    }

    public initialise(sourceGlob:string): Promise<any> {
        if(this.config.useStaticTyping)
        {
            return this.reflection.addGlob(sourceGlob);
        }      
        else{
            return Promise.resolve();
        }
    }

    public lint(html: string, path?:string ): Promise<Issue[]> {
        return this.linter.lint(html, path);
    }
}
