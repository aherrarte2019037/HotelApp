import { Component, OnInit, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Hotel } from 'src/app/models/hotel.model';
import { User, UserRoles } from 'src/app/models/user.model';
import { HotelService } from 'src/app/services/hotel.service';
import { UserService } from 'src/app/services/user.service';
import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexYAxis,
  ApexLegend,
  ApexStroke,
  ApexXAxis,
  ApexFill,
  ApexTooltip,
  ApexNoData
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  fill: ApexFill;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  legend: ApexLegend;
  noData: ApexNoData
};

@Component({
  selector: 'app-charts-page',
  templateUrl: './charts-page.component.html',
  styleUrls: ['./charts-page.component.css']
})
export class ChartsPageComponent implements OnInit {
  users: User[] = [];
  hotels: Hotel[] = [];
  bestSellersOptions: Partial<ChartOptions>;
  likesOptions: Partial<ChartOptions>;
  userOptions: Partial<ChartOptions>;
  showContent: boolean = false;

  constructor(
    private spinnerService: NgxSpinnerService,
    private hotelServce: HotelService,
    private userService: UserService )
  { }

  ngOnInit() {
    this.hotelServce.getAll().subscribe( data =>{
      this.hotels = data;
      this.setBestSellersChart();
      this.setLikesChart();
    })

    this.userService.getAll().subscribe( data =>{ 
      this.users = data;
      this.setUsersChart(); 
    });

    this.spinnerService.show( 'chartSpinner' );

    setTimeout(() => {
      this.showContent = true;
      this.spinnerService.hide( 'chartSpinner' )
    }, 1000);
  }

  setBestSellersChart() {
    const data: any = this.hotels.map( hotel => {
      return { data: [hotel.reservations], name: hotel.name}
    });

    this.bestSellersOptions = {
      series: data,
      chart: {
        type: "bar",
        height: 350
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "20px",
          borderRadius: 15
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"]
      },
      xaxis: {
        categories: [
          "Ventas"
        ]
      },
      yaxis: {
        title: {
          text: "Reservaciones"
        }
      },
      fill: {
        opacity: 1
      },
      tooltip: {
        y: {
          formatter: function(val) {
            return val + " Reservaciones";
          }
        }
      },
    };
  }

  setLikesChart() {
    const data: any = this.hotels.map( hotel => {
      return { data: [hotel.likes, hotel.dislikes], name: hotel.name}
    });

    this.likesOptions = {
      series: data,
      chart: {
        type: "bar",
        height: 350
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "30px",
          borderRadius: 15
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"]
      },
      xaxis: {
        categories: [
          "Me Gusta",
          "No Me Gusta"
        ]
      },
      yaxis: {
        title: {
          text: "Cantidad"
        }
      },
      fill: {
        opacity: 1
      },
      tooltip: {
        y: {
          formatter: function(value, { seriesIndex, dataPointIndex, w }) {
            return w.config.xaxis.categories[seriesIndex] + ' ' + value
          }
        }
      },
    };
  }

  setUsersChart() {
    const userRoles = { client: 0, hotel: 0, app: 0 };

    this.users.forEach( user => {
      if( user.role === UserRoles.client ) userRoles.client++;
      if( user.role === UserRoles.hotel_admin ) userRoles.hotel++;
      if( user.role === UserRoles.app_admin ) userRoles.app++;
    });

    const data: any = [
      { data: [userRoles.client], name: 'Clientes' },
      { data: [userRoles.hotel], name: 'Admin. De Hotel' },
      { data: [userRoles.app], name: 'Admin. De Aplicación' }
    ]

    this.userOptions = {
      series: data,
      chart: {
        type: "bar",
        height: 350
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "30px",
          borderRadius: 15
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"]
      },
      xaxis: {
        categories: [
          "Rol"
        ]
      },
      yaxis: {
        title: {
          text: "Cantidad"
        }
      },
      fill: {
        opacity: 1
      },
      tooltip: {
        y: {
          formatter: function(value, { seriesIndex, dataPointIndex, w }) {
            return value.toString();
          }
        }
      },
    };
  }

}
