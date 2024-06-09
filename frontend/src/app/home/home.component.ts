import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { GameService } from '../home.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  mostPlayedGames: any[] = [];
  trendingGames: any[] = [];
  popularReleases: any[] = [];
  hotReleases: any[] = [];
  selectedTab: string = 'mostPlayedGames';

  constructor(private gameService: GameService) { }

  ngOnInit(): void {
    this.gameService.getGames().subscribe(data => {
      this.mostPlayedGames = data.mostPlayedGames;
      this.trendingGames = data.trendingGames;
      this.popularReleases = data.popularReleases;
      this.hotReleases = data.hotReleases;
    });
  }

  selectTab(tab: string) {
    this.selectedTab = tab;
  }
}
