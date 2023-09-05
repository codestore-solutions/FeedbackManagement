import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CustomFeedbackFormBodySchema, SingleFeedbackTemplateBody, CategoryBasedFeedbackTemplatesDetails, BusinessSpecificFeedbackTemplatesDetails, CategoryList, EntitiesAssociatedWithCategory, FeedbacksAssociatedWithEntity, DetailedFeedbackResponse, LinkGenerationPayload, GeneratedLinkResponse, GetAllLinks} from '../interfaces/feedback';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  constructor(private _http: HttpClient) { }

  baseURL:string = environment.feedbackApiUrl;

  //retrieve all the templates details associated to particular business type
  getBusinessSpecificTemplateDetails():Observable<BusinessSpecificFeedbackTemplatesDetails>{
    return this._http.get<BusinessSpecificFeedbackTemplatesDetails>(`${this.baseURL}feedbackTemplate/getBusinessAdminTemplates`)
  }

  //create a custom template
  createCustomTemplate(data:CustomFeedbackFormBodySchema):Observable<CustomFeedbackFormBodySchema>{
    return this._http.post<CustomFeedbackFormBodySchema>(`${this.baseURL}feedbackTemplate/create`, data)
  }

  //get a unique template by template id
  getTemplateById(templateId:string):Observable<SingleFeedbackTemplateBody>{
    return this._http.get<SingleFeedbackTemplateBody>(`${this.baseURL}feedbackTemplate/getTemplateByIdAndBusinessAdmin/${templateId}`)
  }

  //get category specific templates details
  getCategoryBasedTemplateDetails(categoryId:string):Observable<CategoryBasedFeedbackTemplatesDetails>{
    return this._http.get<CategoryBasedFeedbackTemplatesDetails>(`${this.baseURL}feedbackTemplate/getTemplateByFeebackCategoryId/${categoryId}`);
  }

  //set a particular template as active
  setTemplateAsActive(feedbackTypeId:string, templateId:string):Observable<{message:string; status:number}>{
    return this._http.put<{message:string; status:number}>(`${this.baseURL}feedbackTemplate/activateTemplate/${feedbackTypeId}/${templateId}`, {})
  }

  //get category list for the particular business
  getCategoryList(businessCategoryId:number):Observable<CategoryList>{
    return this._http.get<CategoryList>(`${this.baseURL}serviceCategories/getServices/${businessCategoryId}`)
  }

  //get entities associated with a category
  getEntitiesAssociatedWithCategory(categoryId:string):Observable<EntitiesAssociatedWithCategory>{
    return this._http.get<EntitiesAssociatedWithCategory>(`${this.baseURL}templateResponse/getResponseBasedOnEntityId/${categoryId}`)
  }

  //get feedbacks associated with a entity
  getFeedbacksAssociatedWithEntity(entityId:string, pageNumber:number, pageSize:number):Observable<FeedbacksAssociatedWithEntity>{
    let pageConfig = new HttpParams()
    .set('pageNumber', pageNumber)
    .set('pageSize', pageSize)

    return this._http.get<FeedbacksAssociatedWithEntity>(`${this.baseURL}templateResponse/getResponsesOfEntity/${entityId}`, {params: pageConfig})
  }

  //get detailed feedback response for an entity based on response id
  getDetailedFeedbackResponse(responseId:string):Observable<DetailedFeedbackResponse>{
    return this._http.get<DetailedFeedbackResponse>(`${this.baseURL}templateResponse/getResponseById/${responseId}`)
  }

  //generate template feedback link
  getGeneratedTemplateLink(serviceId:string, businessAdminId:string, data:LinkGenerationPayload):Observable<GeneratedLinkResponse>{
    return this._http.post<GeneratedLinkResponse>(`${this.baseURL}businessAdmin/createLink/${serviceId}/${businessAdminId}`, data)
  }

  //gets all the generated feedback links for a particular template id
  getAllGeneratedLinks(businessAdminId:number, pageNumber:number, pageSize:number):Observable<GetAllLinks>{
    let pageConfig = new HttpParams()
    .set('pageNumber', pageNumber)
    .set('pageSize', pageSize)

    return this._http.get<GetAllLinks>(`${this.baseURL}feedbackLinks/getFeedbackLinks/${businessAdminId}`, {params: pageConfig})
  }
  
}