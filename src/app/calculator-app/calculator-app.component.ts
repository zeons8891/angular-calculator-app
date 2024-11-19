import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { evaluate } from '@suprnation/evaluator';
import { of } from 'rxjs';
import { debounceTime, switchMap, catchError } from 'rxjs/operators';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-calculator-app',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatInputModule, MatButtonModule, MatCardModule, MatListModule,FormsModule],
  templateUrl: './calculator-app.component.html',
  styleUrl: './calculator-app.component.scss',
  providers: [JsonPipe]
})
export class CalculatorAppComponent {

  expression: string = '';
  result: any = '';
  error: string = '';
  history: string[] = [];

  constructor(private jsonPipe: JsonPipe) {
      this.sectionASectionBExercise();
  }

  validateExpression() {
    try {
      const parsedResult = evaluate(this.expression);
      if (parsedResult.success) {
        this.result = evaluate(this.expression);
        this.error = '';
        this.updateHistory(`${this.expression} = ${this.jsonPipe.transform(this.result)}`);
      } else {
        this.error = 'Invalid expression';
        this.result = '';
      }
    } catch (e) {
      this.error = 'Invalid expression';
      this.result = '';
    }
  }

  updateHistory(entry: string) {
    if (this.history.length >= 5) {
      this.history.shift();
    }
    this.history.push(entry);
  }

private sectionASectionBExercise() {

  function sumSquares(a: number, b: number): number {
      return (a > b) ? 0 : a * a + sumSquares(a + 1, b);
  }

  // Sum of Cubes
  function sumCubes(a: number, b: number): number {
      return (a > b) ? 0 : a * a * a + sumCubes(a + 1, b);
  }

  // Sum of Factorials
  function factorial(n: number): number {
      return (n <= 1) ? 1 : n * factorial(n - 1);
  }

  function sumFactorial(a: number, b: number): number {
      return (a > b) ? 0 : factorial(a) + sumFactorial(a + 1, b);
  }

  // General sumMap function
  const sumMap = (mapFn: (value: number) => number) => (a: number, b: number): number => {
      return (a > b) ? 0 : mapFn(a) + sumMap(mapFn)(a + 1, b);
  };

  // Refactored sum functions
  const sumInt2 = sumMap(x => x);
  const sumSquares2 = sumMap(x => x * x);
  const sumCubes2 = sumMap(x => x * x * x);
  const sumFactorial2 = sumMap(factorial);

  // Product of Integers
  function prodInts(a: number, b: number): number {
      return (a > b) ? 1 : a * prodInts(a + 1, b);
  }

  // Product of Squares
  function prodSquares(a: number, b: number): number {
      return (a > b) ? 1 : (a * a) * prodSquares(a + 1, b);
  }

  // Product of Cubes
  function prodCubes(a: number, b: number): number {
      return (a > b) ? 1 : (a * a * a) * prodCubes(a + 1, b);
  }

  // Product of Factorials
  function prodFactorial(a: number, b: number): number {
      return (a > b) ? 1 : factorial(a) * prodFactorial(a + 1, b);
  }

  // General prodMap function
  const prodMap = (mapFn: (value: number) => number) => (a: number, b: number): number => {
      return (a > b) ? 1 : mapFn(a) * prodMap(mapFn)(a + 1, b);
  };

  // Refactored product functions
  const prodInt2 = prodMap(x => x);
  const prodSquares2 = prodMap(x => x * x);
  const prodCubes2 = prodMap(x => x * x * x);
  const prodFactorial2 = prodMap(factorial);

  // General mapReduce function
  const mapReduce = (
      mapFn: (value: number) => number,
      reduceFn: (first: number, second: number) => number,
      zero: number
  ) => (a: number, b: number): number => {
      if (a > b) return zero;
      return reduceFn(mapFn(a), mapReduce(mapFn, reduceFn, zero)(a + 1, b));
  };

  // Refactored mapReduce2 function
  const mapReduce2 = (
      reduceFn: (first: number, second: number) => number,
      zero: number
  ) => (mapFn: (value: number) => number) => (a: number, b: number): number => {
      if (a > b) return zero;
      return reduceFn(mapFn(a), mapReduce2(reduceFn, zero)(mapFn)(a + 1, b));
  };

  // Refactored sumMap2 and prodMap2
  const sumMap2 = mapReduce2((x, y) => x + y, 0);
  const prodMap2 = mapReduce2((x, y) => x * y, 1);

  // Solution to Section B: Building a Functional Tokeniser

  type Token = {
      type: "NUMBER" | "OPERATOR" | "OPEN_PARENTHESIS" | "CLOSE_PARENTHESIS";
      value: string;
  };

  type Success = {
      success: true;
      value: Token[];
      rest: string;
  };

  type Failure = {
      success: false;
      reason: string;
  };

  type Result = Success | Failure;

  const success = (value: Token[], rest: string): Result => ({ success: true, value: value, rest });
  const failure = (reason: string): Result => ({ success: false, reason });

  type Parser = (input: string) => Result;

  // Parsing numbers
  const parseNumber: Parser = (input: string) => {
      const match = /^\d+/.exec(input);
      if (match) {
          return success([
              { type: "NUMBER", value: match[0] }
          ], input.slice(match[0].length));
      }
      return failure("Not a number");
  };

  // Parsing operators
  const parseOperator: Parser = (input: string) => {
      const match = /^[+-]/.exec(input);
      if (match) {
          return success([
              { type: "OPERATOR", value: match[0] }
          ], input.slice(match[0].length));
      }
      return failure("Expected '+ or -'");
  };

  // Parsing parentheses
  const parseCharacter = (char: string, tokenType: Token['type']): Parser => (input: string) => {
      if (input[0] === char) {
          return success([
              { type: tokenType, value: char }
          ], input.slice(1));
      }
      return failure(`Expected '${char}'`);
  };

  const parseOpenParenthesis = parseCharacter('(', "OPEN_PARENTHESIS");
  const parseCloseParenthesis = parseCharacter(')', "CLOSE_PARENTHESIS");

  // Choice between two parsers
  const choice = (p1: Parser, p2: Parser): Parser => (input: string) => {
      const result1 = p1(input);
      return result1.success ? result1 : p2(input);
  };

  // Choice among multiple parsers
  const choiceN = (parsers: Parser[]): Parser => (input: string) => {
      for (const parser of parsers) {
          const result = parser(input);
          if (result.success) {
              return result;
          }
      }
      return failure("Choice parser: All choices failed on input");
  };

  // Zip parser
  const zip = (parser1: Parser, parser2: Parser): Parser => (input: string) => {
      const result1 = parser1(input);
      if (!result1.success) return result1;

      const result2 = parser2(result1.rest);
      if (!result2.success) return result2;

      return success([...result1.value, ...result2.value], result2.rest);
  };

  // doUntil parser
  const isEmpty: Parser = (input) => {
      if (input == '') return success([], "");
      else return failure("Not an empty string");
  };

  const doUntil = (parser: Parser): Parser => (input: string) => {
      let rest = input;
      let tokens: Token[] = [];
      while (rest.length > 0) {
          const result = parser(rest);
          if (!result.success) break;
          tokens = [...tokens, ...result.value];
          rest = result.rest;
      }
      return rest.length === 0 ? success(tokens, rest) : failure("Parsing incomplete");
  };

  // Tokenizer
  const tokenizer = doUntil(choiceN([parseNumber, parseOperator, parseOpenParenthesis, parseCloseParenthesis]));

  //=========Test logic========================================================
  const test = sumSquares(1, 5);
  console.log(test);

 }

}
