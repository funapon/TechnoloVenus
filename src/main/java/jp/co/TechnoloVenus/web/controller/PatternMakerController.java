package jp.co.TechnoloVenus.web.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * pattern_makerページのURLを定義するクラス
 */
@Controller
	/**
	 * pattern_makerページのhtmlファイル名を返すメソッド
	 * @return htmlファイル名
	 */
public class PatternMakerController {
	@GetMapping("/pattern_maker")
	public String goPattern_maker() {
		return "pattern_maker";
	}
}
