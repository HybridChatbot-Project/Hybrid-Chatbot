import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { StatisticsService } from '../../../shared/services/statistics.service';
import { response } from 'express';
import { DatePipe } from '@angular/common';
import { getCurrentDate } from '../../../shared/utils/Date.utils';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { RadioButtonModule } from 'primeng/radiobutton';
import { FormsModule } from '@angular/forms';
import { AnxietyEvaluationRequest } from '../../../shared/interfaces/AnxietyEvaluation.interface';
import {
  getResultByScore,
  getResultNameByScore,
} from '../../../shared/utils/Common.utils';
import { ConfirmationDialogComponent } from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [
    RouterModule,
    CardModule,
    ChartModule,
    ButtonModule,
    DialogModule,
    RadioButtonModule,
    FormsModule,
    ConfirmationDialogComponent,
  ],
  providers: [DatePipe],
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.css',
})
export class StatisticsComponent implements OnInit {
  constructor(
    private statisticsService: StatisticsService,
    private datePipe: DatePipe
  ) {}
  userId = localStorage.getItem('userId');
  currentDate = getCurrentDate();
  chartDataConversationGraph: any;
  chartDataAnxietyGraph: any;
  chartOptionsGraph: any = {
    responsive: true,
    plugins: {
      legend: { display: true },
    },
  };
  showForm: boolean = false;
  optionAvailable = ['No', 'Leve', 'Moderado', 'Bastante'];
  dataInfo = [
    {
      id: 1,
      question: 'Torpe o entumecido',
      selectedOption: null,
      options: this.optionAvailable,
    },
    {
      id: 2,
      question: 'Acalorado',
      selectedOption: null,
      options: this.optionAvailable,
    },
    {
      id: 3,
      question: 'Con temblor en las piernas',
      selectedOption: null,
      options: this.optionAvailable,
    },
    {
      id: 4,
      question: 'Incapaz de relajarse',
      selectedOption: null,
      options: this.optionAvailable,
    },
    {
      id: 5,
      question: 'Con temor a que ocurra lo peor',
      selectedOption: null,
      options: this.optionAvailable,
    },
    {
      id: 6,
      question: 'Mareado, o que se le va la cabeza',
      selectedOption: null,
      options: this.optionAvailable,
    },
    {
      id: 7,
      question: 'Con latidos del corazón fuertes y acelerados',
      selectedOption: null,
      options: this.optionAvailable,
    },
    {
      id: 8,
      question: 'Inestable',
      selectedOption: null,
      options: this.optionAvailable,
    },
    {
      id: 9,
      question: 'Atemorizado o asustado',
      selectedOption: null,
      options: this.optionAvailable,
    },
    {
      id: 10,
      question: 'Nervioso',
      selectedOption: null,
      options: this.optionAvailable,
    },
    {
      id: 11,
      question: 'Con sensación de bloqueo',
      selectedOption: null,
      options: this.optionAvailable,
    },
    {
      id: 12,
      question: 'Con temblores en las manos',
      selectedOption: null,
      options: this.optionAvailable,
    },
    {
      id: 13,
      question: 'Inquieto, inseguro ',
      selectedOption: null,
      options: this.optionAvailable,
    },
    {
      id: 14,
      question: 'Con miedo a perder el control',
      selectedOption: null,
      options: this.optionAvailable,
    },
    {
      id: 15,
      question: 'Con sensación de ahogo',
      selectedOption: null,
      options: this.optionAvailable,
    },
    {
      id: 16,
      question: 'Con temor a morir',
      selectedOption: null,
      options: this.optionAvailable,
    },
    {
      id: 17,
      question: 'Con miedo',
      selectedOption: null,
      options: this.optionAvailable,
    },
    {
      id: 18,
      question: 'Con problemas digestivos',
      selectedOption: null,
      options: this.optionAvailable,
    },
    {
      id: 19,
      question: 'Con desvanecimientos',
      selectedOption: null,
      options: this.optionAvailable,
    },
    {
      id: 20,
      question: 'Con rubor facial',
      selectedOption: null,
      options: this.optionAvailable,
    },
    {
      id: 21,
      question: 'Con sudores, fríos o calientes',
      selectedOption: null,
      options: this.optionAvailable,
    },
  ];
  optionValues = {
    No: 0,
    Leve: 1,
    Moderado: 2,
    Bastante: 3,
  };
  totalScore: number = 0;
  showDialogConfirmation: boolean = false;
  chartOptions = {
    responsive: true,
    layout: {
      padding: {
        top: 15,
        bottom: 15,
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        min: 0.7,
        max: 3.3,
        ticks: {
          stepSize: 1,
          callback: (value: any) => {
            if (value === 1 || value === 2 || value === 3) {
              return getResultNameByScore(value);
            }
            return '';
          },
        },
        type: 'linear',
        afterFit: (scale: any) => {
          scale.paddingTop = 20;
          scale.paddingBottom = 20;
        },
        labels: ['Ansiedad baja', 'Ansiedad moderada', 'Ansiedad severa'],
      },
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem: { raw: any }) =>
            `Nivel: ${getResultNameByScore(tooltipItem.raw)}`,
        },
      },
    },
  };

  ngOnInit(): void {
    this.listWeekConversationGrades();
    this.listWeekAnxietyGrades();
  }

  listWeekConversationGrades() {
    this.statisticsService
      .listWeekConversationGradesByUserId(Number(this.userId), this.currentDate)
      .subscribe({
        next: (response) => {
          if (response.status_code == 200) {
            this.chartDataConversationGraph = {
              labels: response.data.map((x) => x.date.split('T00:00:00')),
              datasets: [
                {
                  label: 'Puntaje',
                  data: response.data.map((x) => x.grade),
                  backgroundColor: '#42A5F5',
                },
              ],
            };
            console.log('conver', this.chartDataConversationGraph);
          }
        },
      });
  }

  listWeekAnxietyGrades() {
    this.statisticsService
      .listWeekAnxietyGradesByUserId(Number(this.userId), this.currentDate)
      .subscribe({
        next: (response) => {
          if (response.status_code == 200) {
            this.chartDataAnxietyGraph = {
              labels: response.data.map((x) => x.date.split('T00:00:00')),
              datasets: [
                {
                  label: 'Nivel de Ansiedad',
                  data: response.data.map((x) => getResultByScore(x.grade)),
                  backgroundColor: '#42A5F5',
                },
              ],
            };
          }
        },
      });
  }

  listMonthConversationGrades() {
    this.statisticsService
      .listMonthConversationGradesByUserId(
        Number(this.userId),
        this.currentDate
      )
      .subscribe({
        next: (response) => {
          if (response.status_code == 200) {
            this.chartDataConversationGraph = {
              labels: response.data.map((x) => x.date.split('T00:00:00')),
              datasets: [
                {
                  label: 'Puntaje',
                  data: response.data.map((x) => x.grade),
                  backgroundColor: '#42A5F5',
                },
              ],
            };
          }
        },
      });
  }

  listMonthAnxietyGrades() {
    this.statisticsService
      .listMonthAnxietyGradesByUserId(Number(this.userId), this.currentDate)
      .subscribe({
        next: (response) => {
          if (response.status_code == 200) {
            console.log('monthanxiety', response.data);
            this.chartDataAnxietyGraph = {
              labels: response.data.map((x) => x.date.split('T00:00:00')),
              datasets: [
                {
                  label: 'Nivel de Ansiedad',
                  data: response.data.map((x) => getResultByScore(x.grade)),
                  backgroundColor: '#42A5F5',
                },
              ],
            };
            console.log(this.chartDataAnxietyGraph);
          }
        },
      });
  }

  changeMode(event: any, event2: any) {
    if (event2 == 'anxiety') {
      event == 'week'
        ? this.listWeekAnxietyGrades()
        : this.listMonthAnxietyGrades();
    } else {
      event == 'week'
        ? this.listWeekConversationGrades()
        : this.listMonthConversationGrades();
    }
  }

  calculateTotalScore() {
    this.totalScore = this.dataInfo.reduce((acc, question) => {
      if (question.selectedOption) {
        return acc + this.optionValues[question.selectedOption];
      }
      return acc;
    }, 0);
    return this.totalScore;
  }

  submitForm() {
    const score = this.calculateTotalScore();
    const req: AnxietyEvaluationRequest = {
      userId: Number(localStorage.getItem('userId')),
      grade: score,
      resultId: getResultByScore(score),
    };
    console.log('req form');
    this.statisticsService.createAnxietyEvaluation(req).subscribe({
      next: (response) => {
        if (response.status_code == 200) {
          console.log('registro existoso');
          this.cancelForm();
        }
      },
    });
  }

  cancelForm() {
    this.dataInfo.forEach((question) => {
      question.selectedOption = null;
    });
    this.showForm = false;
  }
}
