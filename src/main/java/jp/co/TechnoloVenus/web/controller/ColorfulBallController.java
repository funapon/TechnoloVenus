package jp.co.TechnoloVenus.web.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * colorfull_ballページのURLを定義するクラス
 */
@Controller
public class ColorfulBallController {
	/**
	 * colorfull_ballページのhtmlファイル名を返すメソッド
	 * @return htmlファイル名
	 */
	@GetMapping("/colorfull_ball")
	public String gocolorfull_ball() {
		return "colorfull_ball";
	}
}
