import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FeedbackRoutingModule } from './feedback-routing.module';
import { SharedModule } from '../shared/shared.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FeedbackDetailsComponent } from './feedback-details/feedback-details.component';
import { ProfileComponent } from './profile/profile.component';
import { FeedbackTemplatesComponent } from './feedback-templates/feedback-templates.component';
import { FeedbackTemplatePreviewCardComponent } from './feedback-template-preview-card/feedback-template-preview-card.component';
import { ExpandedTemplateViewComponent } from './expanded-template-view/expanded-template-view.component';
import { TemplatePreferencePopupComponent } from './template-preference-popup/template-preference-popup.component';
import { CustomFeedbackGeneratorComponent } from './custom-feedback-generator/custom-feedback-generator.component';
import { CategoryBasedListComponent } from './category-based-list/category-based-list.component';
import { EntityBasedFeedbackListComponent } from './entity-based-feedback-list/entity-based-feedback-list.component';
import { TestNestedTableComponent } from './test-nested-table/test-nested-table.component';
import { OptionCheckboxComponent } from './option-checkbox/option-checkbox.component';
import { OptionRadioComponent } from './option-radio/option-radio.component';
import { EmojiRatingComponent } from './emoji-rating/emoji-rating.component';
import { StarRatingComponent } from './star-rating/star-rating.component';
import { FeedbackTextboxComponent } from './feedback-textbox/feedback-textbox.component';
import { ImageUploaderComponent } from './image-uploader/image-uploader.component';
import { NumberRatingComponent } from './number-rating/number-rating.component';
import { TemplateLinkGeneratorComponent } from './template-link-generator/template-link-generator.component';
import { GeneratedLinksTableComponent } from './generated-links-table/generated-links-table.component';

@NgModule({
  declarations: [
    DashboardComponent,
    FeedbackDetailsComponent,
    ProfileComponent,
    FeedbackTemplatesComponent,
    FeedbackTemplatePreviewCardComponent,
    ExpandedTemplateViewComponent,
    TemplatePreferencePopupComponent,
    CustomFeedbackGeneratorComponent,
    CategoryBasedListComponent,
    EntityBasedFeedbackListComponent,
    TestNestedTableComponent,
    OptionCheckboxComponent,
    OptionRadioComponent,
    EmojiRatingComponent,
    StarRatingComponent,
    FeedbackTextboxComponent,
    ImageUploaderComponent,
    NumberRatingComponent,
    TemplateLinkGeneratorComponent,
    GeneratedLinksTableComponent
  ],
  imports: [
    CommonModule,
    FeedbackRoutingModule,
    SharedModule
  ],
  exports: [
  ]
})
export class FeedbackModule { }
