import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { FeedbackService } from 'src/app/services/feedback.service';

@Component({
  selector: 'app-generated-links-table',
  templateUrl: './generated-links-table.component.html',
  styleUrls: ['./generated-links-table.component.scss']
})
export class GeneratedLinksTableComponent implements OnInit{
  data = [
    {
      entityId:"ID-1",
      entityName:"Headphone X-One",
      link:"example.com/gwte7jhuyd7yoqi8iu3hjwlkuwiuyeuyqidwhd2iy7tyt3tygqjhjknakoqdqiyuytiqoyriqehnzhjg27jdhiugkdlqgekqgwshkjhaehjdhiueykwnzkjsahuduekjsdihejhlqyiqyytzji",
      date:"23-08-2023"
    },
    {
      entityId:"ID-2",
      entityName:"Watch X-Two",
      link:"example.com/gwte7jhuyd7yoqi8iu3hjwlkuwiuyeuyqidwhd2iy7tyt3tygqjhjknakoqdqiyuytiqoyriqehnzhjg27jdhiugkdlqgekqgwshkjhaehjdhiueykwnzkjsahuduekjsdihejhlqyiqyytzji",
      date:"25-08-2023"
    },
    {
      entityId:"ID-3",
      entityName:"Speaker X-Three",
      link:"example.com/gwte7jhuyd7yoqi8iu3hjwlkuwiuyeuyqidwhd2iy7tyt3tygqjhjknakoqdqiyuytiqoyriqehnzhjg27jdhiugkdlqgekqgwshkjhaehjdhiueykwnzkjsahuduekjsdihejhlqyiqyytzji",
      date:"26-08-2023"
    },
    {
      entityId:"ID-1",
      entityName:"Headphone X-One",
      link:"example.com/gwte7jhuyd7yoqi8iu3hjwlkuwiuyeuyqidwhd2iy7tyt3tygqjhjknakoqdqiyuytiqoyriqehnzhjg27jdhiugkdlqgekqgwshkjhaehjdhiueykwnzkjsahuduekjsdihejhlqyiqyytzji",
      date:"23-08-2023"
    },
    {
      entityId:"ID-2",
      entityName:"Watch X-Two",
      link:"example.com/gwte7jhuyd7yoqi8iu3hjwlkuwiuyeuyqidwhd2iy7tyt3tygqjhjknakoqdqiyuytiqoyriqehnzhjg27jdhiugkdlqgekqgwshkjhaehjdhiueykwnzkjsahuduekjsdihejhlqyiqyytzji",
      date:"25-08-2023"
    },
    {
      entityId:"ID-3",
      entityName:"Speaker X-Three",
      link:"example.com/gwte7jhuyd7yoqi8iu3hjwlkuwiuyeuyqidwhd2iy7tyt3tygqjhjknakoqdqiyuytiqoyriqehnzhjg27jdhiugkdlqgekqgwshkjhaehjdhiueykwnzkjsahuduekjsdihejhlqyiqyytzji",
      date:"26-08-2023"
    },
    {
      entityId:"ID-1",
      entityName:"Headphone X-One",
      link:"example.com/gwte7jhuyd7yoqi8iu3hjwlkuwiuyeuyqidwhd2iy7tyt3tygqjhjknakoqdqiyuytiqoyriqehnzhjg27jdhiugkdlqgekqgwshkjhaehjdhiueykwnzkjsahuduekjsdihejhlqyiqyytzji",
      date:"23-08-2023"
    },
    {
      entityId:"ID-2",
      entityName:"Watch X-Two",
      link:"example.com/gwte7jhuyd7yoqi8iu3hjwlkuwiuyeuyqidwhd2iy7tyt3tygqjhjknakoqdqiyuytiqoyriqehnzhjg27jdhiugkdlqgekqgwshkjhaehjdhiueykwnzkjsahuduekjsdihejhlqyiqyytzji",
      date:"25-08-2023"
    },
    {
      entityId:"ID-3",
      entityName:"Speaker X-Three",
      link:"example.com/gwte7jhuyd7yoqi8iu3hjwlkuwiuyeuyqidwhd2iy7tyt3tygqjhjknakoqdqiyuytiqoyriqehnzhjg27jdhiugkdlqgekqgwshkjhaehjdhiueykwnzkjsahuduekjsdihejhlqyiqyytzji",
      date:"26-08-2023"
    },
    {
      entityId:"ID-1",
      entityName:"Headphone X-One",
      link:"example.com/gwte7jhuyd7yoqi8iu3hjwlkuwiuyeuyqidwhd2iy7tyt3tygqjhjknakoqdqiyuytiqoyriqehnzhjg27jdhiugkdlqgekqgwshkjhaehjdhiueykwnzkjsahuduekjsdihejhlqyiqyytzji",
      date:"23-08-2023"
    },
    {
      entityId:"ID-2",
      entityName:"Watch X-Two",
      link:"example.com/gwte7jhuyd7yoqi8iu3hjwlkuwiuyeuyqidwhd2iy7tyt3tygqjhjknakoqdqiyuytiqoyriqehnzhjg27jdhiugkdlqgekqgwshkjhaehjdhiueykwnzkjsahuduekjsdihejhlqyiqyytzji",
      date:"25-08-2023"
    },
    {
      entityId:"ID-3",
      entityName:"Speaker X-Three",
      link:"example.com/gwte7jhuyd7yoqi8iu3hjwlkuwiuyeuyqidwhd2iy7tyt3tygqjhjknakoqdqiyuytiqoyriqehnzhjg27jdhiugkdlqgekqgwshkjhaehjdhiueykwnzkjsahuduekjsdihejhlqyiqyytzji",
      date:"26-08-2023"
    },
    {
      entityId:"ID-1",
      entityName:"Headphone X-One",
      link:"example.com/gwte7jhuyd7yoqi8iu3hjwlkuwiuyeuyqidwhd2iy7tyt3tygqjhjknakoqdqiyuytiqoyriqehnzhjg27jdhiugkdlqgekqgwshkjhaehjdhiueykwnzkjsahuduekjsdihejhlqyiqyytzji",
      date:"23-08-2023"
    },
    {
      entityId:"ID-2",
      entityName:"Watch X-Two",
      link:"example.com/gwte7jhuyd7yoqi8iu3hjwlkuwiuyeuyqidwhd2iy7tyt3tygqjhjknakoqdqiyuytiqoyriqehnzhjg27jdhiugkdlqgekqgwshkjhaehjdhiueykwnzkjsahuduekjsdihejhlqyiqyytzji",
      date:"25-08-2023"
    },
    {
      entityId:"ID-3",
      entityName:"Speaker X-Three",
      link:"example.com/gwte7jhuyd7yoqi8iu3hjwlkuwiuyeuyqidwhd2iy7tyt3tygqjhjknakoqdqiyuytiqoyriqehnzhjg27jdhiugkdlqgekqgwshkjhaehjdhiueykwnzkjsahuduekjsdihejhlqyiqyytzji",
      date:"26-08-2023"
    }
  ]

  dataSource!:MatTableDataSource<{entityId:string; entityName:string; link:string; date:string;}>;
  columnsToDisplay:string[] = ["serial", "entityId", "entityName", "link", "date"];

  constructor(
    private _feedbackService: FeedbackService
  ){}

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.data);
  }

}