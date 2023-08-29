import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { FeedbackService } from 'src/app/services/feedback.service';

@Component({
  selector: 'app-generated-links-table',
  templateUrl: './generated-links-table.component.html',
  styleUrls: ['./generated-links-table.component.scss']
})
export class GeneratedLinksTableComponent implements OnInit{
  
  generatedFeedbackLinks:any;
  dataSource!:MatTableDataSource<{entityId:string; entityName:string; link:string; date:string;}>;
  columnsToDisplay:string[] = ["serial", "entityId", "entityName", "link", "date"];

  constructor(
    private _feedbackService: FeedbackService
  ){}

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.generatedFeedbackLinks);
  }

}