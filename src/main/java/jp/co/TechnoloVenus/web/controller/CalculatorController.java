package jp.co.TechnoloVenus.web.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * calculatorページのURLを定義するクラス
 */
@Controller
public class CalculatorController {
	@GetMapping("/calculator")
	public String goCaluculator() {
		return "calculator";
	}
}
