import { Level } from '@enums/level.enum';
import { PuzzleGameComponent } from '@pages/puzzle-game/puzzle-game.component';
import { LocalstorageGamesService } from '@services/localstorage-games.service';
import { PuzzleService } from '@services/puzzle.service';

import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';

describe('PuzzleGameComponent', () => {
  let component: PuzzleGameComponent;
  let fixture: ComponentFixture<PuzzleGameComponent>;
  let mockPuzzleService: jasmine.SpyObj<PuzzleService>;
  let mockLocalstorageService: jasmine.SpyObj<LocalstorageGamesService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockPuzzle = {
    id: 1,
    name: 'Гриб',
    classColorText: 'text-yellow-900',
    classBackground: 'bg-yellow-900',
    size: 5,
    sizeClasses: 'w-16 h-16',
    rowHints: [[3], [5], [3], [1], [1]],
    colHints: [[1], [3], [5], [3], [1]],
    solution: [
      [false, true, true, true, false],
      [true, true, true, true, true],
      [false, true, true, true, false],
      [false, false, true, false, false],
      [false, false, true, false, false],
    ],
    srcImg: 'assets/images/puzzle-easy-1.webp',
  };

  beforeEach(async () => {
    mockPuzzleService = jasmine.createSpyObj('PuzzleService', [
      'getGridConfigByLevelAndId',
      'createEmptyGrid',
      'updateCell',
    ]);
    mockLocalstorageService = jasmine.createSpyObj('LocalstorageGamesService', [
      'getDataLocalStorageByKey',
      'clearLocalStorageByKey',
      'clearLocaleStorageToAnotherPageByKey',
    ]);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [PuzzleGameComponent],
      providers: [
        { provide: PuzzleService, useValue: mockPuzzleService },
        {
          provide: LocalstorageGamesService,
          useValue: mockLocalstorageService,
        },
        { provide: Router, useValue: mockRouter },
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of({
              get: (key: string) => (key === 'id' ? '1' : Level.Easy),
            }),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PuzzleGameComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load the puzzle on init', () => {
    mockPuzzleService.getGridConfigByLevelAndId.and.returnValue(mockPuzzle);
    mockPuzzleService.createEmptyGrid.and.returnValue(
      Array(5)
        .fill(null)
        .map(() => Array(5).fill({ filled: false, marked: false })),
    );

    component.ngOnInit();

    expect(mockPuzzleService.getGridConfigByLevelAndId).toHaveBeenCalledWith(
      Level.Easy,
      1,
    );
    expect(component.puzzle).toEqual(mockPuzzle);
    expect(component.grid()).toEqual(
      Array(5)
        .fill(null)
        .map(() => Array(5).fill({ filled: false, marked: false })),
    );
  });

  it('should navigate to select puzzle page if puzzle is not found', () => {
    // Мокируем возвращаемые значения сервисов
    mockPuzzleService.getGridConfigByLevelAndId.and.returnValue(undefined); // Пазл не найден
    spyOn(component, 'grid').and.returnValue(
      Array(5)
        .fill(null)
        .map(() => Array(5).fill({ filled: false, marked: false })),
    );

    const navigateSpy = mockRouter.navigate;

    // Инициализация компонента
    component.ngOnInit();

    // Проверяем, что при отсутствии пазла выполняется навигация
    expect(navigateSpy).toHaveBeenCalledWith(['/select-puzzle']);
  });
  it('should update cell state on mouse down', () => {
    const mockGrid = Array(5)
      .fill(null)
      .map(() => Array(5).fill({ filled: false, marked: false }));
    component.grid.set(mockGrid);

    const event = new MouseEvent('mousedown');
    component.onMouseDown(0, 0, event);

    expect(mockPuzzleService.updateCell).toHaveBeenCalled();
  });

  it('should reset game on restart', () => {
    mockPuzzleService.createEmptyGrid.and.returnValue(
      Array(5)
        .fill(null)
        .map(() => Array(5).fill({ filled: false, marked: false })),
    );

    component.puzzle = mockPuzzle;
    component.restartGame();

    expect(component.isSolved()).toBe(false);
    expect(component.completionMessage()).toBe('');
    expect(component.grid()).toEqual(
      Array(5)
        .fill(null)
        .map(() => Array(5).fill({ filled: false, marked: false })),
    );
    expect(mockLocalstorageService.clearLocalStorageByKey).toHaveBeenCalledWith(
      'puzzleGrid',
    );
  });
});
